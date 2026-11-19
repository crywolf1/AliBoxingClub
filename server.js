const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { promisify } = require("node:util");
const {
  createHash,
  randomBytes,
  randomInt,
  randomUUID,
  scrypt: scryptCallback,
  timingSafeEqual,
} = require("node:crypto");
const { MongoClient } = require("mongodb");

const scrypt = promisify(scryptCallback);
const port = Number(process.env.PORT || 3000);
const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE || "ring_boxing";
const sessionCookie = "ring_session";
const coachSessionCookie = "ring_coach_session";
const coachLoginFailures = new Map();
const coachLoginWindowMs = 10 * 60 * 1000;
const coachLoginFailureLimit = 5;
const sessionLifetimeMs = 30 * 24 * 60 * 60 * 1000;
const challengeLifetimeMs = 15 * 60 * 1000;
const challengeLockMs = 60 * 1000;
const challengeFailureLimit = 5;
const subscriptionDurationMs = 30 * 24 * 60 * 60 * 1000;
const clubTimeZone = "Asia/Tehran";
const clubDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: clubTimeZone,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});
const publicFiles = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/dashboard", ["dashboard.html", "text/html; charset=utf-8"]],
  ["/dashboard.html", ["dashboard.html", "text/html; charset=utf-8"]],
  ["/booking", ["booking.html", "text/html; charset=utf-8"]],
  ["/booking.html", ["booking.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/athlete-dashboard.js", ["athlete-dashboard.js", "text/javascript; charset=utf-8"]],
  ["/booking.js", ["booking.js", "text/javascript; charset=utf-8"]],
  ["/coach", ["coach.html", "text/html; charset=utf-8"]],
  ["/coach.html", ["coach.html", "text/html; charset=utf-8"]],
  ["/coach.js", ["coach.js", "text/javascript; charset=utf-8"]],
]);

const seedClasses = [
  { _id: "c1", nameFa: "بوکس پایه", nameEn: "Boxing Fundamentals", descKey: "cardio", days: [6, 1, 3], time: "17:00", type: "public", capacity: 12, booked: 0, price: 250000 },
  { _id: "c2", nameFa: "تکنیک و کیسه", nameEn: "Technique & Bag Work", descKey: "boxing", days: [0, 2, 4], time: "18:30", type: "public", capacity: 10, booked: 0, price: 300000 },
  { _id: "c3", nameFa: "تمرین خصوصی VIP", nameEn: "VIP Coaching", descKey: "vipDesc", days: [6, 1, 3], time: "19:00", type: "vip", capacity: 4, booked: 0, price: 900000 },
  { _id: "c4", nameFa: "آمادگی بدنی", nameEn: "Fight Conditioning", descKey: "strength", days: [0, 2, 4], time: "16:30", type: "public", capacity: 8, booked: 0, price: 280000 },
];

const seedAthletes = [
  { _id: "sample-1", firstName: "آرش", lastName: "کاظمی", phone: "0912•••۱۲۳۴", cardio: 82, power: 76, speed: 69, message: "ریتمت بهتر شده؛ این هفته روی برگشت سریع دست‌ها بعد از ضربه تمرکز کن." },
  { _id: "sample-2", firstName: "سارا", lastName: "محمدی", phone: "0935•••۵۶۷۸", cardio: 74, power: 81, speed: 88, message: "" },
];

function sendJson(response, status, value) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(value));
}

function readJson(request) {
  if (request.body !== undefined) {
    if (request.body && typeof request.body === "object" && !Buffer.isBuffer(request.body)) {
      return Promise.resolve(request.body);
    }
    try {
      return Promise.resolve(request.body ? JSON.parse(String(request.body)) : {});
    } catch {
      return Promise.reject(Object.assign(new Error("Request body must be valid JSON."), { status: 400 }));
    }
  }
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON."), { status: 400 }));
      }
    });
    request.on("error", reject);
  });
}

function cleanAthlete(document) {
  const { _id, phoneNormalized, passwordHash, passwordSalt, ...athlete } = document;
  return { ...athlete, id: _id };
}

function validText(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function normalizePhone(value) {
  const digits = String(value || "")
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  let normalized = digits.replace(/[\s()-]/g, "");
  if (normalized.startsWith("00")) normalized = `+${normalized.slice(2)}`;
  if (!/^\+?\d{8,15}$/.test(normalized)) return null;
  return normalized;
}

function hashValue(value) {
  return createHash("sha256").update(value).digest("hex");
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || "")
    .split(";")
    .map((part) => part.trim().split("="))
    .filter(([name, value]) => name && value)
    .map(([name, ...value]) => [name, decodeURIComponent(value.join("="))]));
}

function setSessionCookie(response, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${sessionCookie}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(sessionLifetimeMs / 1000)}${secure}`);
}

function clearSessionCookie(response) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`);
}

function setCoachSessionCookie(response, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${coachSessionCookie}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(sessionLifetimeMs / 1000)}${secure}`);
}

function clearCoachSessionCookie(response) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${coachSessionCookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`);
}

async function getCoachSession(request, db) {
  const token = parseCookies(request)[coachSessionCookie];
  if (!token) return null;
  return db.collection("coach_sessions").findOne({
    tokenHash: hashValue(token),
    expiresAt: { $gt: new Date() },
  });
}

async function createSession(request, response, db, athleteId) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionLifetimeMs);
  await db.collection("sessions").insertOne({
    tokenHash: hashValue(token),
    athleteId,
    createdAt: new Date(),
    expiresAt,
  });
  setSessionCookie(response, token);
}

async function getSessionAthlete(request, db) {
  const token = parseCookies(request)[sessionCookie];
  if (!token) return null;
  const session = await db.collection("sessions").findOne({
    tokenHash: hashValue(token),
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;
  const athlete = await db.collection("athletes").findOne({ _id: session.athleteId });
  return athlete ? { session, athlete } : null;
}

async function issuePhoneChallenge(db, phone, purpose) {
  const challenges = db.collection("auth_challenges");
  const recent = await challenges.findOne({
    phone,
    purpose,
    createdAt: { $gt: new Date(Date.now() - 60_000) },
  });
  if (recent) {
    throw Object.assign(new Error("Please wait before requesting another verification code."), { status: 429 });
  }
  const code = String(randomInt(100000, 1000000));
  const now = new Date();
  await challenges.deleteMany({ phone, purpose });
  await challenges.insertOne({
    phone,
    purpose,
    codeHash: hashValue(code),
    attempts: 0,
    createdAt: now,
    expiresAt: new Date(now.getTime() + challengeLifetimeMs),
  });
  return code;
}

async function verifyPhoneChallenge(db, phone, purpose, code) {
  const challenges = db.collection("auth_challenges");
  const now = new Date();
  const challenge = await challenges.findOne({
    phone,
    purpose,
    expiresAt: { $gt: now },
  });
  if (!challenge) return null;
  if (challenge.lockedUntil > now) {
    throw Object.assign(new Error("Too many incorrect attempts. Please wait one minute and try again."), { status: 429 });
  }
  if (challenge.lockedUntil) {
    await challenges.updateOne(
      { _id: challenge._id },
      { $set: { attempts: 0 }, $unset: { lockedUntil: "" } },
    );
    challenge.attempts = 0;
  }
  const suppliedHash = Buffer.from(hashValue(String(code || "")), "hex");
  const expectedHash = Buffer.from(challenge.codeHash, "hex");
  const matches = suppliedHash.length === expectedHash.length
    && timingSafeEqual(suppliedHash, expectedHash);
  if (!matches) {
    const attempts = (challenge.attempts || 0) + 1;
    await challenges.updateOne(
      { _id: challenge._id },
      attempts >= challengeFailureLimit
        ? { $set: { attempts: 0, lockedUntil: new Date(now.getTime() + challengeLockMs) } }
        : { $set: { attempts } },
    );
    return null;
  }
  return challenge;
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = (await scrypt(password, salt, 64)).toString("hex");
  return { passwordHash, passwordSalt: salt };
}

async function verifyPassword(password, salt, storedHash) {
  if (!salt || !storedHash) return false;
  const suppliedHash = await scrypt(password, salt, 64);
  const expectedHash = Buffer.from(storedHash, "hex");
  return suppliedHash.length === expectedHash.length && timingSafeEqual(suppliedHash, expectedHash);
}

async function ensureCoachAccount(db) {
  const phone = normalizePhone(process.env.COACH_PHONE || "09386211388");
  const password = process.env.COACH_PASSWORD;
  if (!phone) {
    throw new Error("COACH_PHONE is invalid. Set it to Ali's phone number in .env.");
  }
  if (!password || password.length < 12 || password.length > 128) {
    throw new Error("COACH_PASSWORD must contain 12 to 128 characters. Set it in .env to enable Ali's coach account.");
  }

  const accounts = db.collection("coach_accounts");
  await accounts.createIndex({ phoneNormalized: 1 }, { unique: true });
  const existing = await accounts.findOne({ _id: "ali" });
  const passwordMatches = existing
    ? await verifyPassword(password, existing.passwordSalt, existing.passwordHash)
    : false;
  const phoneMatches = existing?.phoneNormalized === phone;
  const credentials = passwordMatches
    ? { passwordHash: existing.passwordHash, passwordSalt: existing.passwordSalt }
    : await hashPassword(password);

  await accounts.updateOne(
    { _id: "ali" },
    {
      $set: {
        name: "Ali",
        role: "coach",
        phone,
        phoneNormalized: phone,
        ...credentials,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  if (existing && (!passwordMatches || !phoneMatches)) {
    await db.collection("coach_sessions").deleteMany({});
  }
}

function getTrainingProgress(subscription, now = new Date()) {
  const startedAt = new Date(subscription.startedAt);
  const endsAt = new Date(subscription.endsAt);
  const until = now < endsAt ? now : endsAt;
  const scheduledDays = new Set(subscription.days);
  const dateInClubTimeZone = (date) => {
    const parts = Object.fromEntries(clubDateFormatter.formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]));
    return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  };
  const day = dateInClubTimeZone(startedAt);
  const lastDay = dateInClubTimeZone(until);
  day.setUTCDate(day.getUTCDate() + 1);
  let completedTrainingDays = 0;
  while (day <= lastDay) {
    if (scheduledDays.has(day.getUTCDay())) completedTrainingDays += 1;
    day.setUTCDate(day.getUTCDate() + 1);
  }
  const score = Math.min(100, 50 + completedTrainingDays);
  return {
    startedAt,
    endsAt,
    daysLeft: Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))),
    active: endsAt > now,
    days: subscription.days,
    time: subscription.time,
    completedTrainingDays,
    stats: {
      cardio: score,
      power: score,
      speed: score,
      technique: score,
      defense: score,
      footwork: score,
    },
  };
}

async function expireSubscriptions(db) {
  const now = new Date();
  const subscriptions = db.collection("subscriptions");
  const expired = await subscriptions.find({
    status: "active",
    endsAt: { $lte: now },
  }).project({ _id: 1, classId: 1 }).toArray();
  for (const subscription of expired) {
    const result = await subscriptions.updateOne(
      { _id: subscription._id, status: "active", endsAt: { $lte: now } },
      { $set: { status: "expired", expiredAt: now } },
    );
    if (result.modifiedCount) {
      await db.collection("classes").updateOne(
        { _id: subscription.classId, activeSubscriptions: { $gt: 0 } },
        { $inc: { activeSubscriptions: -1 } },
      );
    }
  }
}

async function syncSubscriptionCounts(db) {
  const classes = db.collection("classes");
  await classes.updateMany({}, { $set: { activeSubscriptions: 0 } });
  const activeCounts = await db.collection("subscriptions").aggregate([
    { $match: { status: "active", endsAt: { $gt: new Date() } } },
    { $group: { _id: "$classId", count: { $sum: 1 } } },
  ]).toArray();
  for (const { _id, count } of activeCounts) {
    await classes.updateOne({ _id }, { $set: { activeSubscriptions: count } });
  }
}

async function seedCollection(collection, documents) {
  if (await collection.estimatedDocumentCount() === 0) {
    await collection.insertMany(documents);
  }
}

async function handleApi(request, response, db) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const pathname = url.pathname;
  const classes = db.collection("classes");
  const athletes = db.collection("athletes");
  const bookings = db.collection("bookings");
  const subscriptions = db.collection("subscriptions");
  const fightBookings = db.collection("fight_bookings");
  const assessments = db.collection("assessments");

  if (request.method === "GET" && pathname === "/api/health") {
    await db.command({ ping: 1 });
    sendJson(response, 200, { status: "ok", database: databaseName });
    return;
  }

  if (request.method === "POST" && pathname === "/api/coach/login") {
    const body = await readJson(request);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      sendJson(response, 422, { error: "Invalid sign-in request." });
      return;
    }
    if (!process.env.COACH_PASSWORD || process.env.COACH_PASSWORD.length < 12) {
      sendJson(response, 503, { error: "Sign-in is temporarily unavailable." });
      return;
    }
    const now = Date.now();
    for (const [address, failures] of coachLoginFailures) {
      if (failures.expiresAt <= now) coachLoginFailures.delete(address);
    }
    const address = request.socket.remoteAddress || "unknown";
    let failures = coachLoginFailures.get(address);
    if (!failures || failures.expiresAt <= now) {
      failures = { count: 0, expiresAt: now + coachLoginWindowMs };
      coachLoginFailures.set(address, failures);
    }
    if (failures.count >= coachLoginFailureLimit) {
      sendJson(response, 429, { error: "Too many sign-in attempts. Wait 10 minutes and try again." });
      return;
    }
    const phone = normalizePhone(body.phone);
    const expectedPhone = normalizePhone(process.env.COACH_PHONE || "09386211388");
    if (!phone || phone !== expectedPhone || typeof body.password !== "string" || body.password.length > 128) {
      failures.count += 1;
      sendJson(response, 401, { error: "The phone number or password is incorrect." });
      return;
    }
    const coachAccount = await db.collection("coach_accounts").findOne({
      _id: "ali",
      phoneNormalized: phone,
      role: "coach",
    });
    if (!coachAccount || !await verifyPassword(body.password, coachAccount.passwordSalt, coachAccount.passwordHash)) {
      failures.count += 1;
      sendJson(response, 401, { error: "The phone number or password is incorrect." });
      return;
    }
    coachLoginFailures.delete(address);
    const token = randomBytes(32).toString("base64url");
    await db.collection("coach_sessions").insertOne({
      tokenHash: hashValue(token),
      coachName: "Ali",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + sessionLifetimeMs),
    });
    setCoachSessionCookie(response, token);
    sendJson(response, 200, { coach: { name: "Ali" } });
    return;
  }

  if (request.method === "GET" && pathname === "/api/coach/session") {
    const coach = await getCoachSession(request, db);
    sendJson(response, 200, { coach: coach ? { name: "Ali" } : null });
    return;
  }

  if (request.method === "POST" && pathname === "/api/coach/logout") {
    const token = parseCookies(request)[coachSessionCookie];
    if (token) await db.collection("coach_sessions").deleteOne({ tokenHash: hashValue(token) });
    clearCoachSessionCookie(response);
    sendJson(response, 200, { loggedOut: true });
    return;
  }

  if (request.method === "GET" && pathname === "/api/coach/athletes") {
    if (!await getCoachSession(request, db)) {
      sendJson(response, 401, { error: "Sign in as Ali to view athlete records." });
      return;
    }
    await expireSubscriptions(db);
    const [athleteList, subscriptionList, latestAssessments] = await Promise.all([
      athletes.find().sort({ firstName: 1, lastName: 1 }).toArray(),
      subscriptions.find().sort({ startedAt: -1 }).toArray(),
      assessments.aggregate([
        { $sort: { createdAt: -1 } },
        { $group: { _id: "$athleteId", updatedAt: { $first: "$createdAt" } } },
      ]).toArray(),
    ]);
    const now = new Date();
    const assessmentUpdatedAt = new Map(latestAssessments.map(({ _id, updatedAt }) => [_id, updatedAt]));
    const subscriptionsByAthlete = new Map();
    for (const subscription of subscriptionList) {
      const current = subscriptionsByAthlete.get(subscription.athleteId) || [];
      current.push(subscription);
      subscriptionsByAthlete.set(subscription.athleteId, current);
    }
    const result = athleteList.map((athlete) => {
      const records = subscriptionsByAthlete.get(athlete._id) || [];
      const active = records.filter((subscription) =>
        subscription.status === "active" && new Date(subscription.endsAt) > now);
      const shownSubscriptions = active.length ? active : records.slice(0, 1);
      return {
        ...cleanAthlete(athlete),
        coachUpdatedAt: athlete.coachUpdatedAt || assessmentUpdatedAt.get(athlete._id) || athlete.messageUpdatedAt || null,
        subscriptions: shownSubscriptions.map((subscription) => {
          const startedAt = new Date(subscription.startedAt);
          const endsAt = new Date(subscription.endsAt);
          const elapsedUntil = now < endsAt ? now : endsAt;
          return {
            classNameFa: subscription.classNameFa || "",
            classNameEn: subscription.classNameEn || "",
            startedAt,
            endsAt,
            status: endsAt > now ? "active" : "expired",
            daysEnrolled: Math.min(30, Math.max(0, Math.floor((elapsedUntil - startedAt) / 86400000))),
            daysLeft: Math.max(0, Math.ceil((endsAt - now) / 86400000)),
          };
        }),
      };
    });
    sendJson(response, 200, { athletes: result });
    return;
  }

  const coachAthleteMatch = pathname.match(/^\/api\/coach\/athletes\/([^/]+)$/);
  if (request.method === "PUT" && coachAthleteMatch) {
    if (!await getCoachSession(request, db)) {
      sendJson(response, 401, { error: "Sign in as Ali before updating athlete records." });
      return;
    }
    const id = decodeURIComponent(coachAthleteMatch[1]);
    const body = await readJson(request);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      sendJson(response, 422, { error: "Provide coach scores or a message to save." });
      return;
    }
    const scoreFields = ["cardio", "power", "speed", "technique", "defense", "footwork"];
    const hasScores = scoreFields.some((field) => Object.hasOwn(body, field));
    const updates = {};
    if (hasScores) {
      const scores = scoreFields.map((field) => body[field]);
      const allowedScores = new Set([25, 50, 75, 99]);
      if (scores.some((score) => typeof score !== "number" || !allowedScores.has(score))) {
        sendJson(response, 422, { error: "Choose one of the available rating levels for all six coach scores." });
        return;
      }
      scoreFields.forEach((field, index) => { updates[field] = scores[index]; });
      updates.assessmentStatus = "complete";
    }
    for (const field of ["message", "strengths", "focus", "trainingPlan"]) {
      if (Object.hasOwn(body, field)) {
        if (typeof body[field] !== "string" || body[field].length > 1000) {
          sendJson(response, 422, { error: "Messages and coaching notes must be text with at most 1000 characters." });
          return;
        }
        updates[field] = body[field].trim();
      }
    }
    if (!Object.keys(updates).length) {
      sendJson(response, 422, { error: "Provide coach scores or a message to save." });
      return;
    }
    const athlete = await athletes.findOne({ _id: id });
    if (!athlete) {
      sendJson(response, 404, { error: "Athlete not found." });
      return;
    }
    const now = new Date();
    updates.updatedAt = now;
    updates.coachUpdatedAt = now;
    if (Object.hasOwn(updates, "message")) updates.messageUpdatedAt = now;
    await athletes.updateOne({ _id: id }, { $set: updates });
    await assessments.insertOne({
      athleteId: id,
      ...Object.fromEntries(scoreFields.map((field) => [
        field,
        updates[field] ?? athlete[field] ?? null,
      ])),
      message: updates.message ?? athlete.message ?? "",
      strengths: updates.strengths ?? athlete.strengths ?? "",
      focus: updates.focus ?? athlete.focus ?? "",
      trainingPlan: updates.trainingPlan ?? athlete.trainingPlan ?? "",
      createdAt: now,
    });
    sendJson(response, 200, cleanAthlete(await athletes.findOne({ _id: id })));
    return;
  }

  if (request.method === "GET" && pathname === "/api/bootstrap") {
    await expireSubscriptions(db);
    const classList = await classes.find({ type: { $in: ["public", "vip"] } }).sort({ _id: 1 }).toArray();
    sendJson(response, 200, {
      classes: classList.map(({ _id, ...item }) => ({ ...item, id: _id })),
      athletes: [],
      bookings: {},
    });
    return;
  }

  if (request.method === "GET" && pathname === "/api/auth/me") {
    const authenticated = await getSessionAthlete(request, db);
    sendJson(response, 200, { athlete: authenticated ? cleanAthlete(authenticated.athlete) : null });
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/registration-code") {
    if (process.env.NODE_ENV === "production") {
      sendJson(response, 503, { error: "Phone verification SMS is not configured. Contact the site administrator." });
      return;
    }
    const body = await readJson(request);
    const phone = normalizePhone(body.phone);
    if (!phone) {
      sendJson(response, 422, { error: "Enter a valid phone number containing 8 to 15 digits." });
      return;
    }
    if (await athletes.findOne({ phoneNormalized: phone })) {
      sendJson(response, 409, {
        code: "ATHLETE_PHONE_EXISTS",
        error: "This phone number already has an athlete profile. Sign in or reset its password.",
      });
      return;
    }
    const code = await issuePhoneChallenge(db, phone, "registration");
    sendJson(response, 202, {
      sent: true,
      demoCode: process.env.NODE_ENV === "production" ? undefined : code,
    });
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/verify-registration-code") {
    const body = await readJson(request);
    const phone = normalizePhone(body.phone);
    if (!phone || !/^\d{6}$/.test(String(body.code || ""))) {
      sendJson(response, 422, { error: "Enter the 6-digit verification code." });
      return;
    }
    const challenge = await verifyPhoneChallenge(db, phone, "registration", body.code);
    if (!challenge) {
      sendJson(response, 400, { code: "INVALID_CODE", error: "The verification code is invalid or expired." });
      return;
    }
    await db.collection("auth_challenges").updateOne(
      { _id: challenge._id },
      { $set: { verifiedAt: new Date() } },
    );
    sendJson(response, 200, { verified: true });
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/register") {
    const body = await readJson(request);
    const phone = normalizePhone(body.phone);
    if (!phone || !validText(body.firstName, 50) || !validText(body.lastName, 50)
      || typeof body.password !== "string" || body.password.length < 10 || body.password.length > 128) {
      sendJson(response, 422, { error: "Enter valid names, a phone number, and a password of at least 10 characters." });
      return;
    }
    const verifiedChallenge = await db.collection("auth_challenges").findOne({
      phone,
      purpose: "registration",
      verifiedAt: { $exists: true },
      expiresAt: { $gt: new Date() },
    });
    if (!verifiedChallenge) {
      sendJson(response, 403, { error: "Verify your phone number before creating your profile." });
      return;
    }
    const credentials = await hashPassword(body.password);
    const athlete = {
      _id: randomUUID(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      phone,
      phoneNormalized: phone,
      ...credentials,
      weight: Number.isFinite(Number(body.weight)) ? Number(body.weight) : null,
      height: Number.isFinite(Number(body.height)) ? Number(body.height) : null,
      medicalRecord: typeof body.medicalRecord === "string" ? body.medicalRecord.slice(0, 1000) : "",
      assessmentStatus: "pending",
      cardio: null,
      power: null,
      speed: null,
      technique: null,
      defense: null,
      footwork: null,
      message: "",
      strengths: "",
      focus: "",
      trainingPlan: "",
      createdAt: new Date(),
    };
    try {
      await athletes.insertOne(athlete);
    } catch (error) {
      if (error.code === 11000) {
        sendJson(response, 409, {
          code: "ATHLETE_PHONE_EXISTS",
          error: "This phone number already has an athlete profile. Sign in or reset its password.",
        });
        return;
      }
      throw error;
    }
    await db.collection("auth_challenges").deleteOne({ _id: verifiedChallenge._id });
    await createSession(request, response, db, athlete._id);
    sendJson(response, 201, { athlete: cleanAthlete(athlete) });
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/login") {
    const body = await readJson(request);
    const phone = normalizePhone(body.phone);
    const athlete = phone ? await athletes.findOne({ phoneNormalized: phone }) : null;
    const validPassword = athlete
      ? await verifyPassword(String(body.password || ""), athlete.passwordSalt, athlete.passwordHash)
      : false;
    if (!validPassword) {
      sendJson(response, 401, {
        code: "INVALID_CREDENTIALS",
        error: "The phone number or password is incorrect. If this is an older profile, reset its password first.",
      });
      return;
    }
    await createSession(request, response, db, athlete._id);
    sendJson(response, 200, { athlete: cleanAthlete(athlete) });
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/forgot-password") {
    if (process.env.NODE_ENV === "production") {
      sendJson(response, 503, { error: "Password recovery SMS is not configured. Contact the site administrator." });
      return;
    }
    const body = await readJson(request);
    const phone = normalizePhone(body.phone);
    let demoCode;
    if (phone && await athletes.findOne({ phoneNormalized: phone })) {
      try {
        demoCode = await issuePhoneChallenge(db, phone, "password-reset");
      } catch (error) {
        if (error.status !== 429) throw error;
      }
    }
    sendJson(response, 202, {
      sent: true,
      demoCode: process.env.NODE_ENV === "production" ? undefined : demoCode,
    });
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/reset-password") {
    const body = await readJson(request);
    const phone = normalizePhone(body.phone);
    if (!phone || !/^\d{6}$/.test(String(body.code || ""))
      || typeof body.password !== "string" || body.password.length < 10 || body.password.length > 128) {
      sendJson(response, 422, { error: "Enter the 6-digit code and a password of at least 10 characters." });
      return;
    }
    const challenge = await verifyPhoneChallenge(db, phone, "password-reset", body.code);
    if (!challenge) {
      sendJson(response, 400, { code: "INVALID_CODE", error: "The verification code is invalid or expired." });
      return;
    }
    const credentials = await hashPassword(body.password);
    const athlete = await athletes.findOne({ phoneNormalized: phone }, { projection: { _id: 1 } });
    if (!athlete) {
      sendJson(response, 400, { code: "INVALID_CODE", error: "The verification code is invalid or expired." });
      return;
    }
    await athletes.updateOne({ _id: athlete._id }, { $set: credentials });
    await Promise.all([
      db.collection("auth_challenges").deleteOne({ _id: challenge._id }),
      db.collection("sessions").deleteMany({ athleteId: athlete._id }),
    ]);
    sendJson(response, 200, { reset: true });
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/logout") {
    const token = parseCookies(request)[sessionCookie];
    if (token) await db.collection("sessions").deleteOne({ tokenHash: hashValue(token) });
    clearSessionCookie(response);
    sendJson(response, 200, { loggedOut: true });
    return;
  }

  if (request.method === "POST" && pathname === "/api/fight-bookings") {
    const body = await readJson(request);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)
      || !/^(17|18|19|20):00$/.test(body.time)
      || ![2, 3, 4].includes(Number(body.rounds))) {
      sendJson(response, 422, { error: "Choose a valid date, time, and number of rounds." });
      return;
    }
    const booking = {
      _id: randomUUID(),
      date: body.date,
      time: body.time,
      rounds: Number(body.rounds),
      total: Number(body.rounds) * 5,
      createdAt: new Date(),
    };
    await fightBookings.insertOne(booking);
    const { _id, ...result } = booking;
    sendJson(response, 201, { ...result, id: _id });
    return;
  }

  if (request.method === "POST" && pathname === "/api/athletes") {
    if (!await getCoachSession(request, db)) {
      sendJson(response, 401, { error: "Sign in as Ali before adding an athlete." });
      return;
    }
    const body = await readJson(request);
    const phone = normalizePhone(body.phone);
    if (!validText(body.firstName, 50) || !validText(body.lastName, 50) || !phone
      || typeof body.password !== "string" || body.password.length < 10 || body.password.length > 128) {
      sendJson(response, 422, { error: "Enter valid names, a phone number, and a password of at least 10 characters." });
      return;
    }

    const credentials = await hashPassword(body.password);
    const athlete = {
      _id: randomUUID(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      phone,
      phoneNormalized: phone,
      ...credentials,
      weight: Number.isFinite(Number(body.weight)) ? Number(body.weight) : null,
      height: Number.isFinite(Number(body.height)) ? Number(body.height) : null,
      medicalRecord: typeof body.medicalRecord === "string" ? body.medicalRecord.slice(0, 1000) : "",
      assessmentStatus: "pending",
      cardio: null,
      power: null,
      speed: null,
      technique: null,
      defense: null,
      footwork: null,
      message: "",
      strengths: "",
      focus: "",
      trainingPlan: "",
      createdAt: new Date(),
    };
    try {
      await athletes.insertOne(athlete);
    } catch (error) {
      if (error.code === 11000) {
        sendJson(response, 409, {
          code: "ATHLETE_PHONE_EXISTS",
          error: "This phone number already has an athlete profile. Contact the coach to update or recover it.",
        });
        return;
      }
      throw error;
    }
    sendJson(response, 201, cleanAthlete(athlete));
    return;
  }

  const dashboardMatch = pathname.match(/^\/api\/athletes\/([^/]+)\/dashboard$/);
  if (request.method === "GET" && dashboardMatch) {
    const id = decodeURIComponent(dashboardMatch[1]);
    const authenticated = await getSessionAthlete(request, db);
    if (!authenticated) {
      sendJson(response, 401, { error: "Please sign in to view your athlete dashboard." });
      return;
    }
    if (authenticated.athlete._id !== id) {
      sendJson(response, 403, { error: "You can only view your own athlete dashboard." });
      return;
    }
    const athlete = await athletes.findOne({ _id: id });
    if (!athlete) {
      sendJson(response, 404, { error: "Athlete not found." });
      return;
    }

    await expireSubscriptions(db);
    const [savedAssessments, classBookings, latestSubscription] = await Promise.all([
      assessments.find({ athleteId: id }).sort({ createdAt: -1 }).toArray(),
      bookings.aggregate([
        { $match: { athleteId: id } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "classes",
            localField: "classId",
            foreignField: "_id",
            as: "class",
          },
        },
        { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            classId: 1,
            nameFa: "$class.nameFa",
            nameEn: "$class.nameEn",
            dayFa: "$class.dayFa",
            dayEn: "$class.dayEn",
            time: "$class.time",
          },
        },
      ]).toArray(),
      subscriptions.findOne({ athleteId: id }, { sort: { startedAt: -1 } }),
    ]);

    const history = savedAssessments.length
      ? savedAssessments.map(({ _id, ...assessment }) => ({ ...assessment, id: _id }))
      : [athlete].filter((entry) => [entry.cardio, entry.power, entry.speed]
        .some((score) => score !== null && score !== undefined))
        .map((entry) => ({
          cardio: entry.cardio,
          power: entry.power,
          speed: entry.speed,
          technique: entry.technique ?? null,
          defense: entry.defense ?? null,
          footwork: entry.footwork ?? null,
          message: entry.message || "",
          strengths: entry.strengths || "",
          focus: entry.focus || "",
          trainingPlan: entry.trainingPlan || "",
          createdAt: entry.updatedAt || entry.createdAt || null,
        }));

    sendJson(response, 200, {
      athlete: cleanAthlete(athlete),
      assessments: history,
      latestAssessment: history[0] || null,
      assessmentStatus: history.length ? "complete" : "pending",
      trainingProgress: latestSubscription ? getTrainingProgress(latestSubscription) : null,
      subscriptions: latestSubscription
        ? [{ ...latestSubscription, id: latestSubscription._id, ...getTrainingProgress(latestSubscription) }]
        : [],
      bookings: classBookings.map(({ _id, ...booking }) => ({ ...booking, id: _id })),
    });
    return;
  }

  const assessmentMatch = pathname.match(/^\/api\/athletes\/([^/]+)\/assessment$/);
  if (request.method === "PUT" && assessmentMatch) {
    if (!await getCoachSession(request, db)) {
      sendJson(response, 401, { error: "Sign in as Ali before updating athlete assessments." });
      return;
    }
    const id = decodeURIComponent(assessmentMatch[1]);
    const body = await readJson(request);
    const scoreFields = ["cardio", "power", "speed", "technique", "defense", "footwork"];
    const scores = scoreFields.map((field) => Number(body[field]));
    if (scores.some((score) => !Number.isInteger(score) || score < 0 || score > 100)
      || ["message", "strengths", "focus", "trainingPlan"].some((field) => typeof body[field] !== "string" || body[field].length > 1000)) {
      sendJson(response, 422, { error: "Six scores from 0 to 100 and coaching notes up to 1000 characters are required." });
      return;
    }
    const now = new Date();
    const assessment = {
      athleteId: id,
      cardio: scores[0],
      power: scores[1],
      speed: scores[2],
      technique: scores[3],
      defense: scores[4],
      footwork: scores[5],
      message: body.message.trim(),
      strengths: body.strengths.trim(),
      focus: body.focus.trim(),
      trainingPlan: body.trainingPlan.trim(),
      createdAt: now,
    };
    const result = await athletes.updateOne(
      { _id: id },
      {
        $set: {
          ...Object.fromEntries(scoreFields.map((field, index) => [field, scores[index]])),
          message: assessment.message,
          strengths: assessment.strengths,
          focus: assessment.focus,
          trainingPlan: assessment.trainingPlan,
          assessmentStatus: "complete",
          updatedAt: now,
          coachUpdatedAt: now,
        },
      },
    );
    if (!result.matchedCount) {
      sendJson(response, 404, { error: "Athlete not found." });
      return;
    }
    await assessments.insertOne({ _id: randomUUID(), ...assessment });
    sendJson(response, 200, cleanAthlete(await athletes.findOne({ _id: id })));
    return;
  }

  const bookingMatch = pathname.match(/^\/api\/classes\/([^/]+)\/bookings$/);
  if (request.method === "POST" && bookingMatch) {
    const id = decodeURIComponent(bookingMatch[1]);
    const body = await readJson(request);
    const authenticated = await getSessionAthlete(request, db);
    if (!authenticated) {
      sendJson(response, 401, { error: "Please sign in before booking a class." });
      return;
    }
    if (!validText(body.athleteId, 100)) {
      sendJson(response, 422, { error: "A valid athlete profile is required to book a class." });
      return;
    }
    if (body.athleteId !== authenticated.athlete._id) {
      sendJson(response, 403, { error: "You can only book classes for your own athlete profile." });
      return;
    }
    await expireSubscriptions(db);
    const classItem = await classes.findOne({ _id: id });
    if (!classItem) {
      sendJson(response, 404, { error: "Class not found." });
      return;
    }
    const existing = await subscriptions.findOne({
      athleteId: body.athleteId,
      classId: id,
      status: "active",
      endsAt: { $gt: new Date() },
    });
    if (existing) {
      sendJson(response, 409, { code: "ALREADY_ENROLLED", error: "You already have an active 30-day subscription for this class." });
      return;
    }
    const updated = await classes.updateOne(
      { _id: id, activeSubscriptions: { $lt: classItem.capacity } },
      { $inc: { activeSubscriptions: 1 } },
    );
    if (!updated.modifiedCount) {
      sendJson(response, 409, { code: "CLASS_FULL", error: "This class has no available 30-day places." });
      return;
    }
    const startedAt = new Date();
    const subscription = {
      _id: randomUUID(),
      athleteId: body.athleteId,
      classId: id,
      classNameFa: classItem.nameFa,
      classNameEn: classItem.nameEn,
      days: classItem.days,
      time: classItem.time,
      startedAt,
      endsAt: new Date(startedAt.getTime() + subscriptionDurationMs),
      status: "active",
      createdAt: startedAt,
    };
    try {
      await subscriptions.insertOne(subscription);
    } catch (error) {
      await classes.updateOne({ _id: id }, { $inc: { activeSubscriptions: -1 } });
      if (error.code === 11000) {
        sendJson(response, 409, { code: "ALREADY_ENROLLED", error: "You already have an active 30-day subscription for this class." });
        return;
      }
      throw error;
    }
    sendJson(response, 201, {
      subscription: { ...subscription, ...getTrainingProgress(subscription), id: subscription._id },
      available: Math.max(0, classItem.capacity - Number(classItem.activeSubscriptions || 0) - 1),
    });
    return;
  }

  if (request.method === "POST" && pathname === "/api/classes") {
    if (!await getCoachSession(request, db)) {
      sendJson(response, 401, { error: "Sign in as Ali before managing classes." });
      return;
    }
    const body = await readJson(request);
    const days = Array.isArray(body.days) ? [...new Set(body.days.map(Number))] : [];
    if (!validText(body.nameFa, 60) || !validText(body.nameEn, 60)
      || days.length !== 3 || days.some((day) => !Number.isInteger(day) || day < 0 || day > 6)
      || !/^\d{2}:\d{2}$/.test(body.time)
      || !Number.isInteger(Number(body.capacity)) || Number(body.capacity) < 1 || Number(body.capacity) > 60
      || !["public", "vip"].includes(body.type)) {
      sendJson(response, 422, { error: "Class details are invalid. Select three training days per week, a time, type, and capacity." });
      return;
    }
    const item = {
      _id: randomUUID(),
      nameFa: body.nameFa.trim(),
      nameEn: body.nameEn.trim(),
      descKey: "boxing",
      days,
      time: body.time,
      type: body.type,
      capacity: Number(body.capacity),
      activeSubscriptions: 0,
      price: 300000,
    };
    await classes.insertOne(item);
    const { _id, ...result } = item;
    sendJson(response, 201, { ...result, id: _id });
    return;
  }

  const classMatch = pathname.match(/^\/api\/classes\/([^/]+)$/);
  if (request.method === "DELETE" && classMatch) {
    if (!await getCoachSession(request, db)) {
      sendJson(response, 401, { error: "Sign in as Ali before managing classes." });
      return;
    }
    const result = await classes.deleteOne({ _id: decodeURIComponent(classMatch[1]) });
    if (!result.deletedCount) {
      sendJson(response, 404, { error: "Class not found." });
      return;
    }
    sendJson(response, 200, { deleted: true });
    return;
  }

  sendJson(response, 404, { error: "API route not found." });
}

function serveStatic(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const file = publicFiles.get(url.pathname);
  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  const [filename, contentType] = file;
  fs.readFile(path.join(__dirname, filename), (error, content) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Unable to load the website.");
      return;
    }
    response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-cache" });
    response.end(request.method === "HEAD" ? undefined : content);
  });
}

async function initializeDatabase(db) {
  const athleteCollection = db.collection("athletes");
  const legacyAthletes = await athleteCollection.find({
    phoneNormalized: { $exists: false },
    phone: { $type: "string" },
  }).toArray();
  for (const athlete of legacyAthletes) {
    const phoneNormalized = normalizePhone(athlete.phone);
    if (phoneNormalized) {
      await athleteCollection.updateOne({ _id: athlete._id }, { $set: { phoneNormalized } });
    }
  }
  const duplicatePhone = await athleteCollection.aggregate([
    { $match: { phoneNormalized: { $type: "string" } } },
    { $group: { _id: "$phoneNormalized", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $limit: 1 },
  ]).hasNext();
  if (duplicatePhone) {
    throw new Error("Duplicate athlete phone numbers already exist in MongoDB. Resolve the duplicate profiles before starting the server.");
  }
  await athleteCollection.createIndex({ phoneNormalized: 1 }, { unique: true, partialFilterExpression: { phoneNormalized: { $type: "string" } } });
  await Promise.all([
    db.collection("sessions").createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("coach_sessions").createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection("coach_sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("auth_challenges").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("auth_challenges").createIndex({ phone: 1, purpose: 1 }),
    db.collection("subscriptions").createIndex(
      { athleteId: 1, classId: 1 },
      { unique: true, partialFilterExpression: { status: "active" } },
    ),
    db.collection("subscriptions").createIndex({ status: 1, endsAt: 1 }),
    db.collection("subscriptions").createIndex({ athleteId: 1, startedAt: -1 }),
  ]);
  await ensureCoachAccount(db);
  if (!await db.collection("settings").findOne({ _id: "initial-data" })) {
    await Promise.all([
      seedCollection(db.collection("classes"), seedClasses),
      seedCollection(db.collection("athletes"), seedAthletes),
    ]);
    await db.collection("settings").insertOne({ _id: "initial-data", createdAt: new Date() });
  }
  const defaultDays = new Map([
    ["c1", [6, 1, 3]],
    ["c2", [0, 2, 4]],
    ["c3", [6, 1, 3]],
    ["c4", [0, 2, 4]],
  ]);
  const classCollection = db.collection("classes");
  const classesWithoutSchedule = (await classCollection.find().toArray())
    .filter((item) => !Array.isArray(item.days) || item.days.length !== 3);
  for (const item of classesWithoutSchedule) {
    await classCollection.updateOne(
      { _id: item._id },
      {
        $set: {
          days: defaultDays.get(item._id) || [6, 1, 3],
          activeSubscriptions: Number(item.activeSubscriptions || 0),
        },
        ...(defaultDays.has(item._id) ? { $unset: { booked: "" } } : {}),
      },
    );
  }
  await classCollection.updateMany(
    { activeSubscriptions: { $exists: false } },
    { $set: { activeSubscriptions: 0 } },
  );
  await expireSubscriptions(db);
  await syncSubscriptionCounts(db);
}

async function start() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env and set your MongoDB connection string.");
  }

  const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(databaseName);
  await initializeDatabase(db);

  const server = http.createServer((request, response) => {
    if (request.url.startsWith("/api/")) {
      handleApi(request, response, db).catch((error) => {
        console.error("API request failed:", error);
        if (!response.headersSent) {
          sendJson(response, error.status || 500, { error: error.status ? error.message : "The request could not be completed." });
        }
      });
      return;
    }
    serveStatic(request, response);
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`Ali Boxing Club is running at http://127.0.0.1:${port}`);
    console.log(`MongoDB database: ${databaseName}`);
  });

  const shutdown = async () => {
    server.close();
    await client.close();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

let vercelDbPromise;

async function getVercelDatabase() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }
  if (!vercelDbPromise) {
    const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 });
    vercelDbPromise = client.connect()
      .then(async () => {
        const db = client.db(databaseName);
        await initializeDatabase(db);
        return db;
      })
      .catch((error) => {
        vercelDbPromise = null;
        throw error;
      });
  }
  return vercelDbPromise;
}

async function handleVercelRequest(request, response) {
  try {
    const db = await getVercelDatabase();
    await handleApi(request, response, db);
  } catch (error) {
    console.error("API request failed:", error);
    if (!response.headersSent) {
      sendJson(response, error.status || 500, {
        error: error.status ? error.message : "The request could not be completed.",
      });
    }
  }
}

module.exports = { handleVercelRequest };

if (require.main === module) {
  start().catch((error) => {
    console.error(`Unable to start Ali Boxing Club: ${error.message}`);
    process.exitCode = 1;
  });
}
