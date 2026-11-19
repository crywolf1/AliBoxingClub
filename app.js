const STORAGE_KEYS = {
  profile: "ring.profile",
};

const translations = {
  fa: {
    registered: "پروفایل با موفقیت ذخیره شد.",
    savingProfile: "در حال ذخیره پروفایل…",
    openDashboard: "داشبورد من",
    currentResults: "آخرین نتیجه",
    assessmentHistory: "تاریخچه ارزیابی‌ها",
    noAssessments: "هنوز ارزیابی‌ای ثبت نشده است. نتیجه پس از ثبت مربی اینجا نمایش داده می‌شود.",
    starterStats: "امتیازهای شروع ۵۰ هستند و تا ثبت ارزیابی واقعی مربی، تخمینی باقی می‌مانند.",
    trainingBookings: "جلسه‌های رزروشده",
    noBookings: "هنوز جلسه‌ای رزرو نکرده‌اید.",
    assessmentNote: "بازخورد مربی",
    assessmentDate: "تاریخ ارزیابی",
    dashboardLoadError: "بارگذاری داشبورد انجام نشد.",
    phoneExists: "برای این شماره قبلاً پروفایل ساخته شده و ثبت دوباره مسدود است. برای دسترسی یا اصلاح پروفایل قبلی با مربی تماس بگیرید.",
    invalidCredentials: "شماره موبایل یا رمز عبور اشتباه است.",
    invalidResetCode: "کد بازیابی نادرست یا منقضی شده است.",
    slowDown: "لطفاً کمی صبر کن و دوباره تلاش کن.",
    verified: "شماره تأیید شد. حالا اطلاعات پروفایلت را کامل کن.",
    invalidCode: "کد واردشده درست نیست. کد چاپ‌شده در ترمینال اجرای سرور را بررسی کن.",
    codeSent: "کد آزمایشی روی همین صفحه نمایش داده شده است.",
    recoveryRequested: "اگر این شماره پروفایل داشته باشد، کد بازیابی در ترمینال اجرای سرور چاپ شده است.",
    profileSaved: "پروفایلت ذخیره شد. امتیاز و پیام مربی بعد از ارزیابی در همین بخش قابل مشاهده خواهد بود.",
    classFull: "ظرفیت این کلاس تکمیل شده است.",
    chooseThreeDays: "برای هر کلاس دقیقاً سه روز تمرین در هفته انتخاب کن.",
    alreadyEnrolled: "اشتراک ۳۰ روزه این کلاس را قبلاً فعال کرده‌ای.",
    classAvailability: "ظرفیت باقی‌مانده در هر جلسه",
    weekday0: "یکشنبه",
    weekday1: "دوشنبه",
    weekday2: "سه‌شنبه",
    weekday3: "چهارشنبه",
    weekday4: "پنجشنبه",
    weekday5: "جمعه",
    weekday6: "شنبه",
    threeSessions: "۳ جلسه در هفته",
    subscriptionTitle: "تأیید اشتراک ۳۰ روزه",
    subscriptionDemo: "رزرو، اشتراک ۳۰ روزه را شروع می‌کند. پرداخت آنلاین در این نسخه فعال نیست.",
    booked: "اشتراک ۳۰ روزه فعال شد.",
    fightBooked: "زمان مبارزه رزرو شد. پرداخت واقعی انجام نشد.",
    classAdded: "کلاس به برنامه اضافه شد.",
    classRemoved: "کلاس از برنامه حذف شد.",
    coachSaved: "عملکرد و پیام مربی ذخیره شد.",
    emptyAthletes: "هنوز ورزشکاری ثبت‌نام نکرده است.",
    emptyClasses: "کلاسی در این برنامه وجود ندارد.",
    unavailable: "ظرفیت تکمیل",
    reserve: "رزرو و ادامه",
    viewPlans: "مشاهده اشتراک‌ها",
    available: "ظرفیت",
    spots: "نفر",
    perSession: "هر جلسه",
    public: "عمومی",
    vip: "VIP",
    cardio: "استقامت، تکنیک و آمادگی پایه.",
    boxing: "ترکیب تکنیک بوکس، کیسه و تمرین جفتی.",
    vipDesc: "تمرین محدود و شخصی‌سازی‌شده با مربی.",
    strength: "قدرتی و آماده‌سازی بدنی برای رینگ.",
    coachSavedNote: "مربی عملکرد شما را ثبت کرده است. برای مشاهده امتیازها وارد پروفایل خود شوید.",
    noMessage: "مربی هنوز پیامی ثبت نکرده است.",
    member: "عضو",
    athletes: "ورزشکار",
    classAt: "جلسه",
    filled: "پر شده",
    sessionRemoved: "حذف",
    demoPaymentTitle: "پرداخت آزمایشی",
    demoPaymentBody: "این نسخه فقط رابط کاربری پرداخت را شبیه‌سازی می‌کند. اتصال به درگاه بانکی ایران بعداً انجام می‌شود.",
    confirmDemo: "تأیید پرداخت آزمایشی",
    cancel: "انصراف",
    confirm: "تأیید",
    medicalPrivate: "اطلاعات پزشکی محرمانه است. فقط اطلاعات لازم را وارد کنید؛ در نسخه واقعی به رضایت و حفاظت امن نیاز دارد.",
    loginFirst: "برای رزرو، ابتدا پروفایل خود را بسازید.",
    dateRequired: "لطفاً تاریخ رزرو را انتخاب کنید.",
    wrongPassword: "رمز اشتباه است.",
    adminEnabled: "حالت مربی فعال شد.",
    seat: "جای خالی",
    bookingTitle: "تأیید رزرو",
    paymentFor: "پرداخت آزمایشی برای",
  },
  en: {
    registered: "Profile saved successfully.",
    savingProfile: "Saving your profile…",
    openDashboard: "My dashboard",
    currentResults: "Latest results",
    assessmentHistory: "Assessment history",
    noAssessments: "No assessments yet. Your coach's results will appear here after they are recorded.",
    starterStats: "Starter scores are set to 50 until your coach records real assessment results.",
    trainingBookings: "Booked sessions",
    noBookings: "You haven't booked a session yet.",
    assessmentNote: "Coach feedback",
    assessmentDate: "Assessment date",
    dashboardLoadError: "Could not load your dashboard.",
    phoneExists: "A profile already exists for this phone number, so duplicate registration is blocked. Contact the coach to access or update the existing profile.",
    invalidCredentials: "Phone number or password is incorrect.",
    invalidResetCode: "The verification code is invalid or expired.",
    slowDown: "Please wait a moment before trying again.",
    verified: "Phone verified. Now complete your profile.",
    invalidCode: "That code is incorrect. Check the terminal running the server.",
    codeSent: "The demo code is shown on this screen.",
    recoveryRequested: "If an account exists for this number, its reset code was printed in the server terminal.",
    profileSaved: "Your profile is saved. Your coach's scores and message will appear here after an assessment.",
    classFull: "This class is full.",
    chooseThreeDays: "Select exactly three training days for each class.",
    alreadyEnrolled: "You already have an active 30-day subscription for this class.",
    classAvailability: "Places left per session",
    weekday0: "Sunday",
    weekday1: "Monday",
    weekday2: "Tuesday",
    weekday3: "Wednesday",
    weekday4: "Thursday",
    weekday5: "Friday",
    weekday6: "Saturday",
    threeSessions: "3 sessions per week",
    subscriptionTitle: "Confirm 30-day subscription",
    subscriptionDemo: "Confirming starts a 30-day subscription. Online payment is not enabled in this demo.",
    booked: "Your 30-day subscription is active.",
    fightBooked: "Fight session booked. No real payment was made.",
    classAdded: "Class added to the schedule.",
    classRemoved: "Class removed from the schedule.",
    coachSaved: "Performance scores and coach message saved.",
    emptyAthletes: "No athletes have registered yet.",
    emptyClasses: "No classes are scheduled.",
    unavailable: "FULL",
    reserve: "Reserve & continue",
    viewPlans: "View subscriptions",
    available: "Capacity",
    spots: "spots",
    perSession: "per session",
    public: "PUBLIC",
    vip: "VIP",
    cardio: "Conditioning, technique, and boxing fundamentals.",
    boxing: "Boxing technique, bag work, and partner drills.",
    vipDesc: "Small-group, personalized training with a coach.",
    strength: "Strength and conditioning built for the ring.",
    coachSavedNote: "Your coach has recorded an assessment. Sign in to view your scores.",
    noMessage: "Your coach has not left a message yet.",
    member: "Member",
    athletes: "athletes",
    classAt: "Session",
    filled: "Full",
    sessionRemoved: "Remove",
    demoPaymentTitle: "Demo payment",
    demoPaymentBody: "This version only simulates the payment interface. Iranian bank gateway integration can be added later.",
    confirmDemo: "Confirm demo payment",
    cancel: "Cancel",
    confirm: "Confirm",
    medicalPrivate: "Medical information is sensitive. Enter only what is needed; a real service requires your consent and secure protection.",
    loginFirst: "Create your profile before booking a class.",
    dateRequired: "Please choose a booking date.",
    wrongPassword: "Incorrect password.",
    adminEnabled: "Coach mode enabled.",
    seat: "spots left",
    bookingTitle: "Confirm booking",
    paymentFor: "Demo payment for",
  },
};

let language = localStorage.getItem("ring.language") || "fa";
let activeFilter = "all";
let activeAthleteId = null;
let currentProfile = null;
let coachAuthenticated = false;
let pendingPhone = "";
let activeAuthStep = "phone";
let classesCache = [];
let athletesCache = [];
let bookingsCache = {};

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return fallback;
  }
}

function showDemoCode(elementId, code) {
  const notice = document.getElementById(elementId);
  const value = notice.querySelector("strong");
  if (code) {
    value.textContent = code;
    notice.classList.remove("hidden");
    document.getElementById(elementId === "registration-demo-code" ? "code-input" : "reset-code").value = code;
  } else {
    value.textContent = "";
    notice.classList.add("hidden");
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error);
    showToast(language === "fa" ? "ذخیره‌سازی در مرورگر انجام نشد." : "Could not save data in this browser.", true);
  }
}

async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(language === "fa"
      ? "سرور برنامه در دسترس نیست. از پوشه پروژه دستور npm start را اجرا کنید؛ سایت را با file:// باز نکنید."
      : "The app server is unavailable. Run npm start from the project folder and open http://127.0.0.1:3000 instead of file://.");
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(language === "fa" ? "پاسخ سرور قابل خواندن نیست." : "The server returned an unreadable response.");
  }
  if (!response.ok) {
    throw Object.assign(
      new Error(result.error || (language === "fa" ? "درخواست انجام نشد." : "The request failed.")),
      { status: response.status, code: result.code },
    );
  }
  return result;
}

async function refreshState() {
  const [state, session, coachSession] = await Promise.all([
    apiRequest("/api/bootstrap"),
    apiRequest("/api/auth/me"),
    apiRequest("/api/coach/session"),
  ]);
  classesCache = state.classes;
  athletesCache = state.athletes;
  bookingsCache = state.bookings;
  currentProfile = session.athlete;
  coachAuthenticated = Boolean(coachSession.coach);
  if (currentProfile) {
    saveStorage(STORAGE_KEYS.profile, currentProfile.id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.profile);
  }
  renderClasses();
  renderAdmin();
  updateProfileButtons();
}

async function refreshAfterMutation() {
  try {
    await refreshState();
  } catch (error) {
    showRequestError(error);
  }
}

function showRequestError(error) {
  console.error("Ali Boxing Club request failed:", error);
  showToast(error.message || (language === "fa" ? "ارتباط با سرور برقرار نشد." : "Could not connect to the server."), true);
}

function getClasses() {
  return classesCache;
}

function getAthletes() {
  return athletesCache;
}

function getBookings() {
  return bookingsCache;
}

function getCurrentProfile() {
  return currentProfile;
}

function t(key) {
  return translations[language][key];
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = language === "fa" ? "باشگاه بوکس علی | Ali Boxing Club" : "Ali Boxing Club";
  document.querySelectorAll("[data-fa][data-en]").forEach((element) => {
    element.innerHTML = element.dataset[language];
  });
  document.getElementById("language-toggle").textContent = language === "fa" ? "EN" : "فا";
  document.getElementById("language-toggle").setAttribute("aria-label", language === "fa" ? "Switch to English" : "تغییر زبان به فارسی");
  document.getElementById("nav-toggle").setAttribute("aria-label", language === "fa" ? "باز کردن منو" : "Open navigation");
  document.getElementById("main-navigation").setAttribute("aria-label", language === "fa" ? "ناوبری اصلی" : "Main navigation");
  document.querySelectorAll(".filter-tab").forEach((button) => {
    const active = activeFilter === "all" || button.dataset.filter === activeFilter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  updateProfileButtons();
  renderClasses();
  renderAdmin();
  const profile = getCurrentProfile();
  if (profile && document.getElementById("profile-dialog").open
    && !document.getElementById("profile-step-done").classList.contains("hidden")) {
    renderAthleteReport(profile);
  }
}

function updateProfileButtons() {
  const profileExists = Boolean(getCurrentProfile());
  const accessButton = document.getElementById("profile-access-button");
  if (coachAuthenticated) {
    accessButton.textContent = language === "fa" ? "داشبورد مربی" : "Coach dashboard";
  } else if (profileExists) {
    accessButton.textContent = t("openDashboard");
  } else {
    accessButton.textContent = accessButton.dataset[language];
  }

  document.querySelectorAll("[data-open-profile]").forEach((button) => {
    if (coachAuthenticated) {
      const coachLabel = button.querySelector("[data-coach-fa][data-coach-en]");
      if (coachLabel) {
        coachLabel.textContent = coachLabel.dataset[`coach${language === "fa" ? "Fa" : "En"}`];
      }
      return;
    }
    button.classList.remove("hidden");
    const label = button.querySelector("[data-fa][data-en]");
    if (label) {
      label.textContent = profileExists ? t("openDashboard") : label.dataset[language];
    } else if (profileExists) {
      button.textContent = t("openDashboard");
    } else {
      button.textContent = button.dataset[language];
    }
  });
}

function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.className = `toast${isError ? " error" : ""}`;
  toast.textContent = message;
  document.getElementById("toast-region").append(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function renderClasses() {
  const allPlans = getClasses().filter((item) => ["public", "vip"].includes(item.type));
  const featuredPlanIds = new Set(["public", "vip"]
    .map((type) => allPlans.find((item) => item.type === type)?.id)
    .filter(Boolean));
  const list = allPlans.filter((item) => (
    featuredPlanIds.has(item.id)
    && (activeFilter === "all" || item.type === activeFilter)
  ));
  const grid = document.getElementById("class-grid");
  if (!list.length) {
    grid.innerHTML = `<p class="demo-note">${escapeHTML(t("emptyClasses"))}</p>`;
    return;
  }
  grid.innerHTML = list.map((item) => {
    const activeSubscriptions = Number(item.activeSubscriptions || 0);
    const open = Math.max(0, item.capacity - activeSubscriptions);
    const className = language === "fa" ? item.nameFa : item.nameEn;
    const typeLabel = item.type === "vip" ? t("vip") : t("public");
    const trainingDays = (item.days || []).map((day) => t(`weekday${day}`)).join(language === "fa" ? "، " : ", ");
    return `<article class="class-card">
      <div class="class-card-top"><span class="class-type class-type-${escapeHTML(item.type)}">${escapeHTML(typeLabel)}</span><span class="availability-note"><span class="live-dot"></span>${open > 0 ? `${open} ${escapeHTML(t("spots"))}` : escapeHTML(t("unavailable"))}</span></div>
      <h3>${escapeHTML(className)}</h3>
      <p class="class-schedule-days">${escapeHTML(trainingDays)} <small>· ${escapeHTML(t("threeSessions"))}</small></p>
      <div class="class-schedule-time"><span>${escapeHTML(item.time)}</span><small>${escapeHTML(open > 0 ? t("classAvailability") : t("unavailable"))}</small></div>
      <div class="class-card-bottom"><span class="class-price">${escapeHTML(`${open} / ${item.capacity}`)}<small>${escapeHTML(t("spots"))}</small></span><button class="button button-primary reserve-button" type="button" data-book-class="${escapeHTML(item.id)}">${escapeHTML(t("viewPlans"))}</button></div>
    </article>`;
  }).join("");
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function setProfileStep(step) {
  activeAuthStep = step;
  document.getElementById("auth-feedback").classList.add("hidden");
  ["phone", "verify", "login", "forgot", "reset", "details", "done"].forEach((name) => {
    document.getElementById(`profile-step-${name}`).classList.toggle("hidden", name !== step);
  });
  const headingIds = {
    verify: "verify-title",
    login: "login-title",
    forgot: "forgot-title",
    reset: "reset-title",
    details: "profile-details-title",
    done: "profile-dashboard-title",
  };
  document.getElementById("profile-dialog").setAttribute("aria-labelledby", headingIds[step] || "profile-title");
}

function openProfile() {
  if (coachAuthenticated) {
    window.location.assign("/coach.html");
    return;
  }
  const profile = getCurrentProfile();
  if (profile) {
    window.location.assign("/dashboard");
    return;
  }
  setProfileStep(activeAuthStep);
  openDialog(document.getElementById("profile-dialog"));
}

function openSignIn() {
  if (coachAuthenticated) {
    window.location.assign("/coach.html");
    return;
  }
  if (getCurrentProfile()) {
    window.location.assign("/dashboard");
    return;
  }
  setProfileStep("login");
  openDialog(document.getElementById("profile-dialog"));
}

function showAuthFeedback(error, isError = true) {
  let message = typeof error === "string" ? error : error.message;
  if (typeof error !== "string") {
    if (error.code === "INVALID_CREDENTIALS" || error.status === 401) message = t("invalidCredentials");
    else if (error.code === "INVALID_CODE") message = t("invalidResetCode");
    else if (error.status === 429) message = t("slowDown");
    else if (error.code === "ATHLETE_PHONE_EXISTS") message = t("phoneExists");
  }
  const feedback = document.getElementById("auth-feedback");
  feedback.textContent = message;
  feedback.classList.toggle("error", isError);
  feedback.classList.remove("hidden");
}

function normalizePhoneInput(value) {
  let phone = value.trim()
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[\s()-]/g, "");
  if (phone.startsWith("00")) phone = `+${phone.slice(2)}`;
  return /^\+?\d{8,15}$/.test(phone) ? phone : null;
}

function isCoachPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits === "09386211388" || digits === "989386211388";
}

function authenticate(athlete) {
  currentProfile = athlete;
  saveStorage(STORAGE_KEYS.profile, athlete.id);
  updateProfileButtons();
  const returnTo = new URLSearchParams(window.location.search).get("return");
  window.location.assign(returnTo === "/booking" ? returnTo : "/dashboard");
}

function renderAthleteReport(profile) {
  const report = document.getElementById("athlete-private-report");
  report.innerHTML = `<p class="demo-note">${escapeHTML(language === "fa" ? "در حال بارگذاری داشبورد..." : "Loading your dashboard...")}</p>`;
  apiRequest(`/api/athletes/${encodeURIComponent(profile.id)}/dashboard`)
    .then(({ athlete, assessments, bookings }) => {
      renderAthleteDashboard(report, athlete, assessments, bookings);
    })
    .catch((error) => {
      report.innerHTML = `<p class="demo-note">${escapeHTML(t("dashboardLoadError"))}</p>`;
      showRequestError(error);
    });
}

function renderAthleteDashboard(report, athlete, assessments, bookings) {
  const metrics = language === "fa"
    ? [["استقامت قلبی", athlete.cardio], ["قدرت", athlete.power], ["سرعت", athlete.speed]]
    : [["Cardio", athlete.cardio], ["Power", athlete.power], ["Speed", athlete.speed]];
  const hasScores = metrics.some(([, score]) => score !== null && score !== undefined && score !== "");
  const dateLabel = (value) => {
    if (!value) return language === "fa" ? "—" : "Not dated";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? (language === "fa" ? "—" : "Not dated")
      : date.toLocaleString(language === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium", timeStyle: "short" });
  };
  const scoreCards = (entry, useStarterValues = false) => {
    const values = language === "fa"
      ? [["استقامت", entry.cardio], ["قدرت", entry.power], ["سرعت", entry.speed]]
      : [["Cardio", entry.cardio], ["Power", entry.power], ["Speed", entry.speed]];
    return values.map(([label, score]) => `<div><span>${escapeHTML(label)}</span><strong>${score === null || score === undefined || score === "" ? (useStarterValues ? "50" : "—") : escapeHTML(score)}</strong></div>`).join("");
  };
  const history = assessments.length
    ? assessments.map((entry) => `<article class="assessment-entry">
        <div class="assessment-entry-date"><span>${escapeHTML(t("assessmentDate"))}</span><time>${escapeHTML(dateLabel(entry.createdAt))}</time></div>
        <div class="athlete-report-scores">${scoreCards(entry)}</div>
        ${entry.message ? `<div class="athlete-report-message"><strong>${escapeHTML(t("assessmentNote"))}</strong><p>${escapeHTML(entry.message)}</p></div>` : ""}
      </article>`).join("")
    : `<p class="demo-note">${escapeHTML(t("noAssessments"))}</p>`;
  const bookedSessions = bookings.length
    ? bookings.map((booking) => {
      const name = language === "fa" ? booking.nameFa : booking.nameEn;
      const day = language === "fa" ? booking.dayFa : booking.dayEn;
      return `<li><strong>${escapeHTML(name || (language === "fa" ? "کلاس حذف‌شده" : "Removed class"))}</strong><span>${escapeHTML(day || "")} ${escapeHTML(booking.time || "")}</span><time>${escapeHTML(dateLabel(booking.createdAt))}</time></li>`;
    }).join("")
    : `<li class="dashboard-empty">${escapeHTML(t("noBookings"))}</li>`;

  report.innerHTML = `<div class="dashboard-member">
      <div><span>${escapeHTML(language === "fa" ? "ورزشکار" : "ATHLETE")}</span><strong>${escapeHTML(`${athlete.firstName} ${athlete.lastName}`)}</strong></div>
      <div><span>${escapeHTML(language === "fa" ? "شماره موبایل" : "PHONE")}</span><strong>${escapeHTML(athlete.phone || "—")}</strong></div>
    </div>
    <section class="dashboard-section" aria-labelledby="latest-results-title">
      <div class="athlete-report-title"><span id="latest-results-title">${escapeHTML(t("currentResults"))}</span><span>${escapeHTML(language === "fa" ? "خصوصی" : "PRIVATE")}</span></div>
      ${hasScores ? `<div class="athlete-report-scores">${scoreCards(athlete, true)}</div>` : `<div class="athlete-report-scores">${scoreCards(athlete, true)}</div><p class="demo-note">${escapeHTML(t("starterStats"))}</p>`}
      ${athlete.message ? `<div class="athlete-report-message"><strong>${escapeHTML(t("assessmentNote"))}</strong><p>${escapeHTML(athlete.message)}</p></div>` : ""}
    </section>
    <section class="dashboard-section" aria-labelledby="assessment-history-title">
      <h3 id="assessment-history-title">${escapeHTML(t("assessmentHistory"))}</h3>
      <div class="assessment-history">${history}</div>
    </section>
    <section class="dashboard-section" aria-labelledby="training-bookings-title">
      <h3 id="training-bookings-title">${escapeHTML(t("trainingBookings"))}</h3>
      <ul class="dashboard-bookings">${bookedSessions}</ul>
    </section>`;
}

function openPaymentDialog(title, body, onConfirm, options = {}) {
  const dialog = document.createElement("dialog");
  const eyebrow = options.eyebrow || t("demoPaymentTitle");
  const note = options.note || t("demoPaymentBody");
  const confirmText = options.confirmText || t("confirmDemo");
  dialog.className = "app-dialog payment-dialog";
  dialog.innerHTML = `<button class="dialog-close" type="button" aria-label="${language === "fa" ? "بستن" : "Close"}">×</button>
    <div class="dialog-content"><p class="eyebrow dialog-eyebrow">${escapeHTML(eyebrow)}</p><h2>${escapeHTML(title)}</h2><p class="dialog-help">${escapeHTML(body)}</p><p class="security-note">${escapeHTML(note)}</p><div class="payment-actions"><button class="button button-outline payment-cancel" type="button">${escapeHTML(t("cancel"))}</button><button class="button button-primary payment-confirm" type="button">${escapeHTML(confirmText)}</button></div></div>`;
  document.body.append(dialog);
  const finish = async (confirm) => {
    if (confirm) {
      const confirmButton = dialog.querySelector(".payment-confirm");
      confirmButton.disabled = true;
      try {
        await onConfirm();
      } catch (error) {
        confirmButton.disabled = false;
        showRequestError(error);
        return;
      }
    }
    dialog.close();
    dialog.remove();
  };
  dialog.querySelector(".dialog-close").addEventListener("click", () => finish(false));
  dialog.querySelector(".payment-cancel").addEventListener("click", () => finish(false));
  dialog.querySelector(".payment-confirm").addEventListener("click", () => finish(true));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) finish(false);
  });
  openDialog(dialog);
}

function renderAdmin() {
  const athletes = getAthletes();
  const select = document.getElementById("athlete-select");
  const list = document.getElementById("athlete-list");
  const selectedId = activeAthleteId || select.value || athletes[0]?.id;
  activeAthleteId = selectedId;
  select.innerHTML = athletes.map((athlete) => `<option value="${escapeHTML(athlete.id)}">${escapeHTML(`${athlete.firstName} ${athlete.lastName}`)}</option>`).join("");
  select.value = athletes.some((athlete) => athlete.id === selectedId) ? selectedId : (athletes[0]?.id || "");
  if (!athletes.length) {
    list.innerHTML = `<p class="demo-note">${escapeHTML(t("emptyAthletes"))}</p>`;
    document.getElementById("coach-form").classList.add("hidden");
  } else {
    document.getElementById("coach-form").classList.remove("hidden");
    const athlete = athletes.find((entry) => entry.id === select.value);
    if (athlete) {
      document.querySelector("#coach-form [name='cardio']").value = athlete.cardio ?? "";
      document.querySelector("#coach-form [name='power']").value = athlete.power ?? "";
      document.querySelector("#coach-form [name='speed']").value = athlete.speed ?? "";
      document.querySelector("#coach-form [name='technique']").value = athlete.technique ?? "";
      document.querySelector("#coach-form [name='defense']").value = athlete.defense ?? "";
      document.querySelector("#coach-form [name='footwork']").value = athlete.footwork ?? "";
      document.getElementById("coach-message").value = athlete.message || "";
      document.getElementById("coach-strengths").value = athlete.strengths || "";
      document.getElementById("coach-focus").value = athlete.focus || "";
      document.getElementById("coach-training-plan").value = athlete.trainingPlan || "";
    }
    list.innerHTML = athletes.map((athlete) => `<div class="athlete-row"><span>${escapeHTML(`${athlete.firstName} ${athlete.lastName}`)}</span><small>${escapeHTML(athlete.phone || "")}</small><small>${t("member")}</small></div>`).join("");
  }
  const classes = getClasses();
  const adminList = document.getElementById("admin-class-list");
  const bookings = getBookings();
  adminList.innerHTML = classes.length ? classes.map((item) => {
    const name = language === "fa" ? item.nameFa : item.nameEn;
    const day = (item.days || []).map((value) => t(`weekday${value}`)).join(language === "fa" ? "، " : ", ");
    const active = Number(item.activeSubscriptions || 0);
    return `<div class="admin-class-row"><span>${escapeHTML(name)} <small>· ${escapeHTML(day)} · ${escapeHTML(item.time)} · ${Math.max(0, item.capacity - active)}/${item.capacity} ${escapeHTML(t("spots"))}</small></span><button type="button" data-remove-class="${escapeHTML(item.id)}">${escapeHTML(t("sessionRemoved"))}</button></div>`;
  }).join("") : `<p class="demo-note">${escapeHTML(t("emptyClasses"))}</p>`;
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

document.querySelectorAll("[data-open-profile]").forEach((button) => button.addEventListener("click", openProfile));
document.getElementById("profile-access-button").addEventListener("click", openSignIn);
document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
const profileDialog = document.getElementById("profile-dialog");
profileDialog.addEventListener("cancel", (event) => event.preventDefault());
document.querySelectorAll(".filter-tab").forEach((button) => button.addEventListener("click", () => {
  activeFilter = activeFilter === button.dataset.filter ? "all" : button.dataset.filter;
  applyLanguage();
}));

document.getElementById("show-login").addEventListener("click", () => setProfileStep("login"));
document.getElementById("show-register").addEventListener("click", () => setProfileStep("phone"));
document.getElementById("show-forgot").addEventListener("click", () => {
  document.getElementById("forgot-phone").value = document.getElementById("login-phone").value;
  setProfileStep("forgot");
});
document.getElementById("forgot-back-login").addEventListener("click", () => setProfileStep("login"));

document.getElementById("phone-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const phoneInput = document.getElementById("phone-input");
  const phone = normalizePhoneInput(phoneInput.value);
  if (!phone) {
    showToast(language === "fa" ? "شماره تلفن معتبر وارد کنید." : "Enter a valid phone number.", true);
    return;
  }
  if (isCoachPhone(phone)) {
    window.location.assign("/coach.html");
    return;
  }
  phoneInput.value = phone;
  pendingPhone = phone;
  try {
    const result = await apiRequest("/api/auth/registration-code", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    setProfileStep("verify");
    showDemoCode("registration-demo-code", result.demoCode);
    document.getElementById("code-input").focus();
    if (!result.demoCode) showToast(t("codeSent"));
  } catch (error) {
    if (error.status === 409 && error.code === "ATHLETE_PHONE_EXISTS") {
      document.getElementById("login-phone").value = phone;
      setProfileStep("login");
      showAuthFeedback(t("phoneExists"));
      return;
    }
    showAuthFeedback(error);
  }
});

document.getElementById("verify-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const code = document.getElementById("code-input").value.trim()
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  try {
    await apiRequest("/api/auth/verify-registration-code", {
      method: "POST",
      body: JSON.stringify({ phone: pendingPhone, code }),
    });
    setProfileStep("details");
    showToast(t("verified"));
  } catch (error) {
    showAuthFeedback(error);
  }
});

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const phone = normalizePhoneInput(String(form.get("phone") || ""));
  if (!phone) {
    showAuthFeedback(language === "fa" ? "شماره موبایل معتبر وارد کن." : "Enter a valid phone number.");
    return;
  }
  if (isCoachPhone(phone)) {
    const password = String(form.get("password") || "");
    try {
      await apiRequest("/api/coach/login", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      });
      window.location.assign("/coach.html");
    } catch (error) {
      showAuthFeedback(error);
    }
    return;
  }
  try {
    const result = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password: String(form.get("password") || "") }),
    });
    authenticate(result.athlete);
  } catch (error) {
    showAuthFeedback(error);
  }
});
document.getElementById("back-to-phone").addEventListener("click", () => setProfileStep("phone"));
document.getElementById("forgot-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const phone = normalizePhoneInput(document.getElementById("forgot-phone").value);
  if (!phone) {
    showAuthFeedback(language === "fa" ? "شماره موبایل معتبر وارد کن." : "Enter a valid phone number.");
    return;
  }
  pendingPhone = phone;
  try {
    const result = await apiRequest("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    setProfileStep("reset");
    showDemoCode("reset-demo-code", result.demoCode);
    showAuthFeedback(t("recoveryRequested"), false);
  } catch (error) {
    showAuthFeedback(error);
  }
});

document.getElementById("reset-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const password = String(form.get("password") || "");
  if (password !== String(form.get("passwordConfirm") || "")) {
    showAuthFeedback(language === "fa" ? "رمزهای عبور یکسان نیستند." : "The passwords do not match.");
    return;
  }
  const code = String(form.get("code") || "")
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  try {
    await apiRequest("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ phone: pendingPhone, code, password }),
    });
    document.getElementById("login-phone").value = pendingPhone;
    formElement.reset();
    setProfileStep("login");
    showToast(language === "fa" ? "رمز عبور تغییر کرد. حالا وارد شو." : "Password updated. You can now sign in.");
  } catch (error) {
    showAuthFeedback(error);
  }
});

document.getElementById("profile-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  document.getElementById("profile-error").classList.add("hidden");
  const form = new FormData(event.currentTarget);
  const password = String(form.get("password") || "");
  if (password !== String(form.get("passwordConfirm") || "")) {
    showAuthFeedback(language === "fa" ? "رمزهای عبور یکسان نیستند." : "The passwords do not match.");
    return;
  }
  const profile = {
    phone: pendingPhone,
    firstName: String(form.get("firstName")).trim(),
    lastName: String(form.get("lastName")).trim(),
    weight: Number(form.get("weight")),
    height: Number(form.get("height")),
    medicalRecord: String(form.get("medicalRecord") || "").trim(),
    password,
  };
  await profileFormSubmit(profile);
});

async function profileFormSubmit(profile) {
  const submitButton = document.querySelector("#profile-form button[type='submit']");
  const submitLabel = submitButton.querySelector("[data-fa][data-en]");
  const originalLabel = submitLabel.textContent;
  submitButton.disabled = true;
  submitLabel.textContent = t("savingProfile");
  try {
    const result = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(profile),
    });
    const savedProfile = result.athlete;
    saveStorage(STORAGE_KEYS.profile, savedProfile.id);
    activeAthleteId = savedProfile.id;
    currentProfile = savedProfile;
    updateProfileButtons();
    await refreshAfterMutation();
    document.getElementById("profile-success").textContent = `${savedProfile.firstName} ${savedProfile.lastName} — ${t("profileSaved")}`;
    renderAthleteReport(savedProfile);
    setProfileStep("done");
    showToast(t("registered"));
    window.location.assign("/dashboard");
  } catch (error) {
    if (error.status === 409 && error.code === "ATHLETE_PHONE_EXISTS") {
      const notice = document.getElementById("profile-error");
      notice.textContent = t("phoneExists");
      notice.classList.remove("hidden");
      return;
    }
    showAuthFeedback(error);
  } finally {
    submitButton.disabled = false;
    submitLabel.textContent = originalLabel;
  }
}

document.getElementById("class-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-book-class]");
  if (button) window.location.assign("/booking");
});

const fightRounds = document.getElementById("fight-rounds");
function updateFightTotal() {
  document.getElementById("fight-total").textContent = `$${Number(fightRounds.value) * 5}`;
}
fightRounds.addEventListener("change", updateFightTotal);
document.getElementById("fight-date").min = new Date().toISOString().slice(0, 10);
document.getElementById("fight-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formElement = event.currentTarget;
  const date = document.getElementById("fight-date").value;
  const time = document.getElementById("fight-time").value;
  const rounds = Number(fightRounds.value);
  if (!date) {
    showToast(t("dateRequired"), true);
    return;
  }
  openPaymentDialog(`${t("bookingTitle")} · ${rounds} ${language === "fa" ? "راند" : "rounds"} · $${rounds * 5}`, `${date} · ${time} · ${rounds} × $5`, async () => {
    await apiRequest("/api/fight-bookings", {
      method: "POST",
      body: JSON.stringify({ date, time, rounds }),
    });
    showToast(t("fightBooked"));
    formElement.reset();
    updateFightTotal();
  });
});

document.querySelectorAll("[data-admin-tab]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-admin-tab]").forEach((tab) => tab.classList.toggle("active", tab === button));
  const athletesActive = button.dataset.adminTab === "athletes";
  document.getElementById("admin-athletes-panel").classList.toggle("hidden", !athletesActive);
  document.getElementById("admin-classes-panel").classList.toggle("hidden", athletesActive);
}));

document.getElementById("athlete-select").addEventListener("change", (event) => {
  activeAthleteId = event.target.value;
  renderAdmin();
});
document.getElementById("coach-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const athlete = getAthletes().find((entry) => entry.id === document.getElementById("athlete-select").value);
  if (!athlete) return;
  apiRequest(`/api/athletes/${encodeURIComponent(athlete.id)}/assessment`, {
  method: "PUT",
  body: JSON.stringify({
    cardio: Number(form.get("cardio")),
    power: Number(form.get("power")),
    speed: Number(form.get("speed")),
    technique: Number(form.get("technique")),
    defense: Number(form.get("defense")),
    footwork: Number(form.get("footwork")),
    message: String(form.get("message") || "").trim(),
    strengths: String(form.get("strengths") || "").trim(),
    focus: String(form.get("focus") || "").trim(),
    trainingPlan: String(form.get("trainingPlan") || "").trim(),
  }),
  }).then(async () => {
  showToast(t("coachSaved"));
  await refreshAfterMutation();
  const profile = getCurrentProfile();
  if (profile?.id === athlete.id && document.getElementById("profile-dialog").open) {
    renderAthleteReport(profile);
  }
  }).catch(showRequestError);
});
document.getElementById("add-athlete-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const athlete = {
    id: `athlete-${Date.now()}`,
    firstName: String(form.get("firstName")).trim(),
    lastName: String(form.get("lastName")).trim(),
    phone: String(form.get("phone")).trim(),
    password: String(form.get("password") || ""),
    weight: null,
    height: null,
    medicalRecord: "",
    cardio: null,
    power: null,
    speed: null,
    message: "",
  };
  apiRequest("/api/athletes", { method: "POST", body: JSON.stringify(athlete) })
    .then(async (savedAthlete) => {
      activeAthleteId = savedAthlete.id;
      formElement.reset();
      showToast(language === "fa" ? "ورزشکار اضافه شد." : "Athlete added.");
      await refreshAfterMutation();
    })
    .catch(showRequestError);
});
document.getElementById("add-class-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const time = String(form.get("time"));
  const days = form.getAll("days").map(Number);
  if (days.length !== 3) {
    showToast(t("chooseThreeDays"), true);
    return;
  }
  const newClass = {
    nameFa: String(form.get("nameFa")).trim(),
    nameEn: String(form.get("nameEn")).trim(),
    days,
    time,
    type: String(form.get("type")),
    capacity: Number(form.get("capacity")),
  };
  apiRequest("/api/classes", { method: "POST", body: JSON.stringify(newClass) })
    .then(async () => {
      formElement.reset();
      showToast(t("classAdded"));
      await refreshAfterMutation();
    })
    .catch(showRequestError);
});
document.getElementById("admin-class-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-class]");
  if (!button) return;
  apiRequest(`/api/classes/${encodeURIComponent(button.dataset.removeClass)}`, { method: "DELETE" })
    .then(async () => {
      showToast(t("classRemoved"));
      await refreshAfterMutation();
    })
    .catch(showRequestError);
});

document.querySelectorAll("dialog").forEach((dialog) => {
  if (dialog === profileDialog) return;
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});
document.getElementById("year").textContent = new Date().getFullYear();
applyLanguage();
refreshState().catch((error) => {
  showRequestError(error);
}).then(() => {
  if (new URLSearchParams(window.location.search).get("signin") === "1") {
    openSignIn();
  }
});
