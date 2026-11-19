const bookingText = {
  fa: {
    public: "عمومی",
    vip: "VIP",
    month: "۳۰ روز",
    perMonth: "برای یک ماه",
    sessions: "۳ جلسه در هفته",
    available: "ظرفیت باقی‌مانده",
    noSpots: "ظرفیت تکمیل است",
    reserve: "رزرو اشتراک",
    signInFirst: "ابتدا وارد حساب شو",
    active: "اشتراک فعال",
    activeUntil: "فعال تا",
    daysLeft: "روز باقی‌مانده",
    alreadyActive: "این اشتراک را داری",
    noPlans: "در حال حاضر برنامه‌ای برای رزرو وجود ندارد.",
    loadFailed: "بارگذاری برنامه‌ها انجام نشد. دوباره تلاش کن.",
    signInRequired: "برای رزرو اشتراک ابتدا وارد حساب ورزشکارت شو.",
    bookingFailed: "رزرو اشتراک انجام نشد. دوباره تلاش کن.",
    booked: "اشتراک یک‌ماهه با موفقیت فعال شد.",
    publicDescription: "تمرین گروهی بوکس در سطح عمومی.",
    vipDescription: "تمرین VIP با برنامه اختصاصی و ظرفیت محدود.",
    cardio: "بوکس پایه",
    boxing: "تکنیک و کیسه",
    vipDesc: "تمرین خصوصی VIP",
    strength: "آمادگی بدنی",
    tomans: "تومان",
  },
  en: {
    public: "Public",
    vip: "VIP",
    month: "30 days",
    perMonth: "for one month",
    sessions: "3 sessions per week",
    available: "Places available",
    noSpots: "Fully booked",
    reserve: "Subscribe",
    signInFirst: "Sign in to subscribe",
    active: "Active subscription",
    activeUntil: "Active until",
    daysLeft: "days remaining",
    alreadyActive: "Already subscribed",
    noPlans: "There are no plans available right now.",
    loadFailed: "Could not load plans. Please try again.",
    signInRequired: "Sign in to your athlete account before booking a subscription.",
    bookingFailed: "Could not book the subscription. Please try again.",
    booked: "Your one-month subscription is active.",
    publicDescription: "Group boxing training for the public level.",
    vipDescription: "Personalized VIP coaching with limited places.",
    cardio: "Boxing Fundamentals",
    boxing: "Technique & Bag Work",
    vipDesc: "VIP Coaching",
    strength: "Fight Conditioning",
    tomans: "toman",
  },
};

const weekdays = {
  fa: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

let language = localStorage.getItem("ring.language") === "en" ? "en" : "fa";
let athlete = null;
let plans = [];
let plansLoaded = false;
let currentSubscription = null;
let selectedPlan = null;

const byId = (id) => document.getElementById(id);
const t = (key) => bookingText[language][key];

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store", ...options });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(t("loadFailed"));
  }
  if (!response.ok) {
    throw Object.assign(new Error(payload.error || t("loadFailed")), { code: payload.code, status: response.status });
  }
  return payload;
}

function formatPrice(price) {
  const formatted = new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US").format(Number(price) || 0);
  return language === "fa" ? `${formatted} ${t("tomans")}` : `${formatted} ${t("tomans")}`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(language === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium", timeZone: "Asia/Tehran" });
}

function renderPlans() {
  const container = byId("booking-plans");
  if (!plans.length) {
    container.innerHTML = plansLoaded ? `<p class="booking-status">${escapeHTML(t("noPlans"))}</p>` : "";
    return;
  }
  container.innerHTML = plans.map((plan) => {
    const activeForPlan = currentSubscription?.classId === plan.id
      && new Date(currentSubscription.endsAt).getTime() > Date.now();
    const available = Math.max(0, Number(plan.capacity || 0) - Number(plan.activeSubscriptions || 0));
    const typeLabel = plan.type === "vip" ? t("vip") : t("public");
    const className = language === "fa" ? plan.nameFa : plan.nameEn;
    const description = t(plan.descKey) || (plan.type === "vip" ? t("vipDescription") : t("publicDescription"));
    const days = (plan.days || []).map((day) => weekdays[language][day]).filter(Boolean).join(language === "fa" ? "، " : ", ");
    const subscriptionDetails = activeForPlan
      ? `<div class="booking-active-status"><strong>${escapeHTML(t("active"))}</strong><span>${escapeHTML(t("activeUntil"))}: ${escapeHTML(formatDate(currentSubscription.endsAt))} · ${Math.max(0, Math.ceil((new Date(currentSubscription.endsAt).getTime() - Date.now()) / 86400000))} ${escapeHTML(t("daysLeft"))}</span></div>`
      : "";
    const buttonText = !athlete
      ? t("signInFirst")
      : activeForPlan
        ? t("alreadyActive")
        : available > 0
          ? t("reserve")
          : t("noSpots");
    return `<article class="booking-plan-card booking-plan-${escapeHTML(plan.type)}">
      <div class="booking-plan-top"><span class="booking-plan-type">${escapeHTML(typeLabel)}</span><span class="booking-plan-duration">${escapeHTML(t("month"))}</span></div>
      <h2>${escapeHTML(className)}</h2>
      <p class="booking-plan-description">${escapeHTML(description)}</p>
      <div class="booking-plan-price"><strong>${escapeHTML(formatPrice(plan.price))}</strong><span>${escapeHTML(t("perMonth"))}</span></div>
      <ul class="booking-plan-details">
        <li>${escapeHTML(t("sessions"))}</li>
        <li>${escapeHTML(days)}${plan.time ? ` · ${escapeHTML(plan.time)}` : ""}</li>
        <li>${escapeHTML(available > 0 ? `${t("available")}: ${available}` : t("noSpots"))}</li>
      </ul>
      ${subscriptionDetails}
      <button class="button ${plan.type === "vip" ? "button-primary" : "button-outline"} booking-plan-button" type="button" data-book-plan="${escapeHTML(plan.id)}" ${!athlete || activeForPlan || available <= 0 ? "disabled" : ""}>${escapeHTML(buttonText)}</button>
    </article>`;
  }).join("");
}

function updateLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  document.title = language === "fa" ? "رزرو اشتراک | باشگاه بوکس علی" : "Subscriptions | Ali Boxing Club";
  document.querySelectorAll("[data-fa][data-en]").forEach((element) => {
    element.innerHTML = element.dataset[language];
  });
  byId("booking-language").textContent = language === "fa" ? "EN" : "فا";
  byId("booking-language").setAttribute("aria-label", language === "fa" ? "Switch to English" : "تغییر زبان به فارسی");
  renderPlans();
}

function openConfirmation(plan) {
  selectedPlan = plan;
  const title = language === "fa" ? plan.nameFa : plan.nameEn;
  byId("booking-confirm-title").textContent = `${t("reserve")}: ${title}`;
  byId("booking-confirm-description").textContent = `${formatPrice(plan.price)} · ${t("month")}`;
  byId("booking-feedback").textContent = "";
  byId("booking-confirm").disabled = false;
  byId("booking-confirm-dialog").showModal();
}

async function loadBookingData() {
  byId("booking-status").textContent = language === "fa" ? "در حال بارگذاری برنامه‌ها…" : "Loading plans…";
  byId("booking-status").classList.remove("hidden");
  byId("booking-login").classList.add("hidden");
  try {
    const bootstrap = await requestJson("/api/bootstrap");
    const allClasses = bootstrap.classes || [];
    const publicPlan = allClasses.find((item) => item.type === "public");
    const vipPlan = allClasses.find((item) => item.type === "vip");
    plans = [publicPlan, vipPlan].filter(Boolean);
    plansLoaded = true;
    currentSubscription = null;
    renderPlans();
    byId("booking-status").classList.add("hidden");

    const session = await requestJson("/api/auth/me");
    athlete = session.athlete;
    if (!athlete) {
      byId("booking-login").classList.remove("hidden");
      renderPlans();
      return;
    }

    const dashboard = await requestJson(`/api/athletes/${encodeURIComponent(athlete.id)}/dashboard`);
    currentSubscription = (dashboard.subscriptions || []).find((subscription) =>
      subscription.status === "active" && new Date(subscription.endsAt).getTime() > Date.now()) || null;
    renderPlans();
  } catch (error) {
    byId("booking-status").textContent = error.message || t("loadFailed");
    byId("booking-status").classList.remove("hidden");
    if (plans.length) renderPlans();
  }
}

byId("booking-language").addEventListener("click", () => {
  language = language === "fa" ? "en" : "fa";
  localStorage.setItem("ring.language", language);
  updateLanguage();
});

byId("booking-plans").addEventListener("click", (event) => {
  const button = event.target.closest("[data-book-plan]");
  if (!button || button.disabled) return;
  const plan = plans.find((item) => item.id === button.dataset.bookPlan);
  if (plan) openConfirmation(plan);
});

byId("booking-confirm").addEventListener("click", async () => {
  if (!selectedPlan || !athlete) return;
  const button = byId("booking-confirm");
  button.disabled = true;
  byId("booking-feedback").textContent = "";
  try {
    await requestJson(`/api/classes/${encodeURIComponent(selectedPlan.id)}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athleteId: athlete.id }),
    });
    byId("booking-confirm-dialog").close();
    await loadBookingData();
    byId("booking-status").textContent = t("booked");
    byId("booking-status").classList.remove("hidden");
  } catch (error) {
    byId("booking-feedback").textContent = error.code === "ALREADY_ENROLLED"
      ? t("alreadyActive")
      : error.message || t("bookingFailed");
    button.disabled = false;
  }
});

byId("booking-dialog-close").addEventListener("click", () => byId("booking-confirm-dialog").close());
byId("booking-cancel").addEventListener("click", () => byId("booking-confirm-dialog").close());
byId("booking-confirm-dialog").addEventListener("click", (event) => {
  if (event.target === byId("booking-confirm-dialog")) byId("booking-confirm-dialog").close();
});
byId("booking-year").textContent = new Date().getFullYear();
updateLanguage();
loadBookingData();
