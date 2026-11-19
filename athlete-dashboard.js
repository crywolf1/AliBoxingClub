const translations = {
  fa: {
    loadFailed: "اطلاعات داشبورد بارگذاری نشد. دوباره تلاش کن یا به باشگاه برگرد.",
    noProfile: "پروفایلی در این مرورگر پیدا نشد. ابتدا در باشگاه پروفایل ورزشکار بساز.",
    profileLink: "ساخت پروفایل",
    memberSince: "عضو باشگاه بوکس علی",
    phone: "موبایل",
    kg: "کیلوگرم",
    cm: "سانتی‌متر",
    noValue: "ثبت نشده",
    noScore: "—",
    pending: "در انتظار ارزیابی مربی",
    improvement: "نسبت به ارزیابی قبل",
    firstAssessment: "اولین ارزیابی",
    points: "امتیاز",
    cardio: "استقامت",
    power: "قدرت",
    speed: "سرعت",
    technique: "تکنیک",
    defense: "دفاع",
    footwork: "جا‌به‌جایی پا",
    strengths: "نقاط قوت",
    focus: "تمرکز بعدی",
    trainingPlan: "برنامه تا ارزیابی بعد",
    coachMessage: "یادداشت مربی",
    emptyGuidance: "مربی هنوز برنامه‌ای ثبت نکرده است. پس از ارزیابی، راهنمای شخصی اینجا نمایش داده می‌شود.",
    noHistory: "هنوز ارزیابی‌ای ثبت نشده است.",
    score: "امتیاز",
    activeSubscription: "اشتراک فعال",
    expiredSubscription: "اشتراک پایان یافته",
    daysLeft: "روز تا پایان اشتراک",
    subscriptionEnds: "پایان اشتراک",
    noSubscription: "هنوز اشتراک ۳۰ روزه‌ای رزرو نشده است.",
    subscriptionProgressNote: "آمار تمرینی تخمینی از ۵۰ شروع می‌شود و برای هر روز تمرین برنامه‌ریزی‌شده ۱ امتیاز افزایش می‌یابد؛ حضور واقعی ثبت نمی‌شود.",
    estimatedStats: "تخمین بر اساس روزهای تمرین؛ ارزیابی مربی جایگزین می‌شود",
    starterStats: "امتیاز شروع ۵۰؛ در انتظار ارزیابی مربی",
    coachStats: "ارزیابی مربی",
    mixedStats: "امتیازهای مربی همراه با تخمین اولیه",
  },
  en: {
    loadFailed: "Could not load your dashboard. Try again or return to the club.",
    noProfile: "No athlete profile was found in this browser. Create your profile at the club first.",
    profileLink: "Create profile",
    memberSince: "Ali Boxing Club member",
    phone: "Phone",
    kg: "kg",
    cm: "cm",
    noValue: "Not recorded",
    noScore: "—",
    pending: "Pending coach assessment",
    improvement: "vs previous assessment",
    firstAssessment: "First assessment",
    points: "pts",
    cardio: "Cardio",
    power: "Power",
    speed: "Speed",
    technique: "Technique",
    defense: "Defense",
    footwork: "Footwork",
    strengths: "Strengths",
    focus: "Next focus",
    trainingPlan: "Plan until next assessment",
    coachMessage: "Coach note",
    emptyGuidance: "Your coach hasn't added a plan yet. Personalized guidance will appear here after an assessment.",
    noHistory: "No assessments yet.",
    score: "Score",
    activeSubscription: "Active subscription",
    expiredSubscription: "Subscription ended",
    daysLeft: "days remaining",
    subscriptionEnds: "Ends",
    noSubscription: "No 30-day subscription has been reserved yet.",
    subscriptionProgressNote: "Training estimates start at 50 and rise by 1 for each scheduled training day. Actual attendance is not tracked.",
    estimatedStats: "Training-day estimate; coach ratings take priority",
    starterStats: "Starting score: 50 · Awaiting coach assessment",
    coachStats: "Coach-assessed stats",
    mixedStats: "Coach ratings with starter estimates",
  },
};

const scoreKeys = ["cardio", "power", "speed", "technique", "defense", "footwork"];
let language = localStorage.getItem("ring.language") || "fa";
let currentSubscription = null;

function text(key) {
  return translations[language][key];
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function formatDate(value) {
  if (!value) return text("noValue");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return text("noValue");
  return date.toLocaleString(language === "fa" ? "fa-IR" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function scoreValue(value) {
  const score = Number(value);
  return value !== null && value !== undefined && value !== "" && Number.isFinite(score) ? score : null;
}

function scoreRatingClass(value) {
  const score = scoreValue(value);
  if (score === null) return "";
  if (score <= 25) return "rating-25";
  if (score <= 50) return "rating-50";
  if (score <= 75) return "rating-75";
  return "rating-99";
}

function renderPerformance(athlete, latest, previous, trainingProgress) {
  const grid = document.getElementById("performance-grid");
  const coachScores = Object.fromEntries(scoreKeys.map((key) => [
    key,
    scoreValue(athlete[key] ?? latest?.[key]),
  ]));
  const hasCoachScores = Object.values(coachScores).some((score) => score !== null);
  const hasEstimatedScores = scoreKeys.some((key) => coachScores[key] === null);
  document.getElementById("stats-caption").textContent = hasCoachScores
    ? (hasEstimatedScores ? text("mixedStats") : text("coachStats"))
    : (trainingProgress ? text("estimatedStats") : text("starterStats"));
  grid.innerHTML = scoreKeys.map((key) => {
    const coachValue = coachScores[key];
    const value = coachValue ?? scoreValue(trainingProgress?.stats?.[key]) ?? 50;
    const prior = coachValue === null ? null : scoreValue(previous?.[key]);
    const delta = coachValue !== null && prior !== null ? coachValue - prior : null;
    const source = coachValue !== null
      ? delta === null
        ? `<span class="score-change">${escapeHTML(text("firstAssessment"))}</span>`
        : `<span class="score-change ${delta > 0 ? "positive" : delta < 0 ? "negative" : ""}">${delta > 0 ? "+" : ""}${delta} ${escapeHTML(text("points"))} ${escapeHTML(text("improvement"))}</span>`
      : trainingProgress
        ? `<span class="score-change estimated-label">${escapeHTML(text("estimatedStats"))}</span>`
        : `<span class="score-change estimated-label">${escapeHTML(text("starterStats"))}</span>`;
    return `<article class="performance-card ${scoreRatingClass(value)}">
      <div class="performance-card-top"><span>${escapeHTML(text(key))}</span><strong>${value}<small>/100</small></strong></div>
      <div class="performance-meter${coachValue === null ? " is-estimated" : ""}" role="progressbar" aria-label="${escapeHTML(text(key))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><span style="width:${value}%"></span></div>
      ${source}
    </article>`;
  }).join("");
}

function renderSubscription(subscription) {
  currentSubscription = subscription;
  const status = document.getElementById("subscription-status");
  const countdown = document.getElementById("subscription-countdown");
  const endDate = document.getElementById("subscription-end-date");
  const schedule = document.getElementById("subscription-schedule");
  const note = document.getElementById("subscription-note");
  if (!subscription) {
    status.textContent = text("noSubscription");
    countdown.textContent = "";
    endDate.textContent = "";
    schedule.textContent = "";
    note.textContent = "";
    return;
  }
  const endsAt = new Date(subscription.endsAt);
  const remaining = Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 86400000));
  const active = endsAt.getTime() > Date.now();
  status.textContent = text(active ? "activeSubscription" : "expiredSubscription");
  countdown.textContent = active ? `${remaining} ${text("daysLeft")}` : "";
  endDate.textContent = `${text("subscriptionEnds")}: ${formatDate(subscription.endsAt)}`;
  const className = language === "fa" ? subscription.classNameFa : subscription.classNameEn;
  schedule.textContent = `${className || ""} · ${(subscription.days || []).map((day) => text(`weekday${day}`)).join(language === "fa" ? "، " : ", ")} · ${subscription.time || ""}`;
  note.textContent = text("subscriptionProgressNote");
}

function guidanceCard(key, value) {
  if (!value) return "";
  return `<article class="coach-guidance-card"><h3>${escapeHTML(text(key))}</h3><p>${escapeHTML(value)}</p></article>`;
}

function renderGuidance(athlete, latest) {
  const cards = [
    guidanceCard("strengths", latest?.strengths || athlete.strengths),
    guidanceCard("focus", latest?.focus || athlete.focus),
    guidanceCard("trainingPlan", latest?.trainingPlan || athlete.trainingPlan),
    guidanceCard("coachMessage", athlete.message || latest?.message),
  ].filter(Boolean);
  document.getElementById("coach-guidance").innerHTML = cards.length
    ? cards.join("")
    : `<p class="dashboard-empty-copy">${escapeHTML(text("emptyGuidance"))}</p>`;
}

function renderHistory(assessments) {
  const history = document.getElementById("assessment-history");
  if (!assessments.length) {
    history.innerHTML = `<p class="dashboard-empty-copy">${escapeHTML(text("noHistory"))}</p>`;
    return;
  }
  history.innerHTML = assessments.map((assessment) => `<article class="timeline-entry">
    <div class="timeline-marker" aria-hidden="true"></div>
    <div class="timeline-card">
      <time>${escapeHTML(formatDate(assessment.createdAt))}</time>
      <div class="timeline-scores">${scoreKeys.map((key) => {
        const score = scoreValue(assessment[key]);
        return `<span class="${scoreRatingClass(score)}">${escapeHTML(text(key))}<strong>${score === null ? escapeHTML(text("noScore")) : score}</strong></span>`;
      }).join("")}</div>
      ${assessment.focus ? `<p><strong>${escapeHTML(text("focus"))}:</strong> ${escapeHTML(assessment.focus)}</p>` : ""}
      ${assessment.message ? `<p><strong>${escapeHTML(text("coachMessage"))}:</strong> ${escapeHTML(assessment.message)}</p>` : ""}
    </div>
  </article>`).join("");
}

function renderDashboard({ athlete, assessments, trainingProgress, subscriptions }) {
  const latest = assessments[0] || null;
  const previous = assessments[1] || null;
  const latestSubscription = subscriptions?.[0] || null;
  const fullName = `${athlete.firstName || ""} ${athlete.lastName || ""}`.trim();
  document.getElementById("athlete-name").textContent = fullName || text("memberSince");
  document.getElementById("athlete-initials").textContent = [...fullName].slice(0, 2).join("") || "R";
  document.getElementById("athlete-since").textContent = text("memberSince");
  document.getElementById("athlete-phone").textContent = athlete.phone || text("noValue");
  document.getElementById("athlete-weight").textContent = athlete.weight ? `${athlete.weight} ${text("kg")}` : text("noValue");
  document.getElementById("athlete-height").textContent = athlete.height ? `${athlete.height} ${text("cm")}` : text("noValue");
  document.getElementById("last-assessment-date").textContent = formatDate(latest?.createdAt);
  document.getElementById("welcome-message").textContent = language === "fa"
    ? `${fullName}، مسیر پیشرفتت را با آمار و راهنمای مربی دنبال کن.`
    : `${fullName}, follow your progress with stats and coaching guidance.`;
  renderPerformance(athlete, latest, previous, trainingProgress);
  renderSubscription(latestSubscription);
  renderGuidance(athlete, latest);
  renderHistory(assessments);
  document.getElementById("dashboard-content").classList.remove("hidden");
}

window.setInterval(() => {
  renderSubscription(currentSubscription);
}, 60 * 1000);

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = language === "fa" ? "داشبورد ورزشکار | باشگاه بوکس علی" : "Athlete Dashboard | Ali Boxing Club";
  document.querySelectorAll("[data-fa][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });
  document.getElementById("language-toggle").textContent = language === "fa" ? "EN" : "فا";
  document.getElementById("language-toggle").setAttribute("aria-label", language === "fa" ? "Switch to English" : "تغییر زبان به فارسی");
  document.getElementById("nav-toggle").setAttribute("aria-label", language === "fa" ? "باز کردن منو" : "Open navigation");
  document.getElementById("main-navigation").setAttribute("aria-label", language === "fa" ? "ناوبری اصلی" : "Main navigation");
  const profileId = localStorage.getItem("ring.profile");
  if (!profileId) localStorage.removeItem("ring.profile");
  loadDashboard();
}

async function loadDashboard() {
  const notice = document.getElementById("dashboard-notice");
  notice.classList.add("hidden");
  try {
    const sessionResponse = await fetch("/api/auth/me", { cache: "no-store" });
    const session = await sessionResponse.json();
    if (!sessionResponse.ok) throw new Error(session.error || text("loadFailed"));
    if (!session.athlete) {
      localStorage.removeItem("ring.profile");
      document.getElementById("athlete-name").textContent = language === "fa" ? "ورزشکار باشگاه بوکس علی" : "Ali Boxing Club athlete";
      notice.innerHTML = `${escapeHTML(text("noProfile"))} <a href="/">${escapeHTML(text("profileLink"))}</a>`;
      notice.classList.remove("hidden");
      return;
    }
    localStorage.setItem("ring.profile", session.athlete.id);
    const profileId = session.athlete.id;
    const response = await fetch(`/api/athletes/${encodeURIComponent(profileId)}/dashboard`, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || text("loadFailed"));
    renderDashboard(result);
  } catch (error) {
    if (error.message === "Athlete not found." || error.message.includes("sign in")) {
      localStorage.removeItem("ring.profile");
      notice.innerHTML = `${escapeHTML(text("noProfile"))} <a href="/">${escapeHTML(text("profileLink"))}</a>`;
    } else {
      notice.textContent = error.message || text("loadFailed");
    }
    notice.classList.remove("hidden");
  }
}

document.getElementById("language-toggle").addEventListener("click", () => {
  language = language === "fa" ? "en" : "fa";
  localStorage.setItem("ring.language", language);
  applyLanguage();
});
const navigationToggle = document.getElementById("nav-toggle");
const mainNavigation = document.getElementById("main-navigation");
function closeMobileNavigation() {
  navigationToggle.setAttribute("aria-expanded", "false");
  mainNavigation.classList.remove("is-open");
}
navigationToggle.addEventListener("click", () => {
  const isExpanded = navigationToggle.getAttribute("aria-expanded") === "true";
  navigationToggle.setAttribute("aria-expanded", String(!isExpanded));
  mainNavigation.classList.toggle("is-open", !isExpanded);
});
mainNavigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileNavigation));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileNavigation();
});
document.getElementById("logout-button").addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  localStorage.removeItem("ring.profile");
  window.location.assign("/");
});
document.getElementById("year").textContent = new Date().getFullYear();

applyLanguage();
