const coachText = {
  fa: {
    loginError: "ورود انجام نشد.",
    loading: "در حال بارگذاری ورزشکاران…",
    noAthletes: "ورزشکاری پیدا نشد.",
    filterAll: "همه ورزشکاران",
    filterActive: "اشتراک فعال",
    filterExpired: "اشتراک پایان‌یافته",
    filterNone: "بدون اشتراک",
    loadError: "بارگذاری ورزشکاران ناموفق بود.",
    noSubscription: "اشتراک فعالی وجود ندارد.",
    expired: "پایان‌یافته",
    daysLeft: "روز باقی‌مانده",
    daysEnrolled: "روز عضویت",
    started: "شروع",
    ends: "پایان",
    lastUpdated: "آخرین به‌روزرسانی مربی",
    notUpdated: "هنوز ارزیابی یا پیامی ثبت نشده است.",
    saving: "در حال ذخیره…",
    saved: "امتیازها و پیام برای این ورزشکار ذخیره شد و در داشبورد او نمایش داده می‌شود.",
    saveError: "ذخیره تغییرات ناموفق بود.",
    completeScores: "برای ثبت امتیاز، هر شش عدد را وارد کنید.",
    emptyUpdate: "برای ذخیره، امتیاز یا پیام وارد کنید.",
    logoutError: "خروج ناموفق بود.",
  },
  en: {
    loginError: "Sign in failed.",
    loading: "Loading athletes…",
    noAthletes: "No athletes found.",
    filterAll: "All athletes",
    filterActive: "Active subscription",
    filterExpired: "Expired subscription",
    filterNone: "No subscription",
    loadError: "Could not load athletes.",
    noSubscription: "No active subscription.",
    expired: "Expired",
    daysLeft: "days left",
    daysEnrolled: "days enrolled",
    started: "Started",
    ends: "Ends",
    lastUpdated: "Coach last updated",
    notUpdated: "No coach assessment or message yet.",
    saving: "Saving…",
    saved: "Scores and message were saved for this athlete and will appear in their dashboard.",
    saveError: "Could not save changes.",
    completeScores: "Enter all six scores to save an assessment.",
    emptyUpdate: "Enter scores or a message before saving.",
    logoutError: "Sign out failed.",
  },
};

let coachLanguage = "fa";
let athletes = [];
let selectedAthleteId = null;

const byId = (id) => document.getElementById(id);
const t = (key) => coachText[coachLanguage][key];

function scoreRatingClass(value) {
  const score = Number(value);
  if (!Number.isFinite(score) || score <= 0) return "";
  if (score <= 25) return "rating-25";
  if (score <= 50) return "rating-50";
  if (score <= 75) return "rating-75";
  return "rating-99";
}

function updateScoreSelect(select) {
  select.classList.remove("rating-25", "rating-50", "rating-75", "rating-99");
  const ratingClass = scoreRatingClass(select.value);
  if (ratingClass) select.classList.add(ratingClass);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

async function coachRequest(url, options = {}) {
  const { headers = {}, ...requestOptions } = options;
  const response = await fetch(url, {
    credentials: "same-origin",
    ...requestOptions,
    headers: { "Content-Type": "application/json", ...headers },
  });
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }
  if (!response.ok) {
    throw Object.assign(new Error(payload.error || `Request failed (${response.status}).`), { status: response.status });
  }
  return payload;
}

function showCoachWorkspace() {
  byId("coach-login-panel").classList.add("hidden");
  byId("coach-workspace").classList.remove("hidden");
  byId("coach-logout").classList.remove("hidden");
}

function setLanguage(language) {
  const draft = selectedAthleteId
    ? Object.fromEntries(new FormData(byId("coach-assessment-form")).entries())
    : null;
  coachLanguage = language;
  document.documentElement.lang = language;
  byId("coach-language").textContent = language === "fa" ? "EN" : "فا";
  document.querySelectorAll("[data-fa][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });
  const search = byId("athlete-search");
  search.placeholder = search.dataset[language === "fa" ? "placeholderFa" : "placeholderEn"];
  if (selectedAthleteId) {
    renderAthleteDetail();
    if (draft) {
      for (const [field, value] of Object.entries(draft)) {
        byId("coach-assessment-form").elements[field].value = value;
        const element = byId("coach-assessment-form").elements[field];
        if (element.matches("select")) updateScoreSelect(element);
      }
    }
  }
  renderAthleteList();
}

function normalizedSearch(value) {
  return String(value || "")
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .toLocaleLowerCase()
    .trim();
}

function formatCoachUpdateDate(value) {
  if (!value) return t("notUpdated");
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tehran",
  }).format(new Date(value));
}

function renderAthleteList() {
  const query = normalizedSearch(byId("athlete-search").value);
  const filter = byId("athlete-filter").value;
  const getSubscriptionStatus = (athlete) => {
    const subscription = athlete.subscriptions?.[0];
    if (!subscription) return "none";
    return subscription.status === "active" ? "active" : "expired";
  };
  const visibleAthletes = athletes.filter((athlete) => {
    const text = normalizedSearch(`${athlete.firstName} ${athlete.lastName} ${athlete.phone}`);
    return text.includes(query) && (filter === "all" || getSubscriptionStatus(athlete) === filter);
  });
  const statusOrder = { active: 0, expired: 1, none: 2 };
  visibleAthletes.sort((first, second) => {
    const statusDifference = statusOrder[getSubscriptionStatus(first)] - statusOrder[getSubscriptionStatus(second)];
    if (statusDifference) return statusDifference;
    const firstUpdated = first.coachUpdatedAt ? new Date(first.coachUpdatedAt).getTime() : 0;
    const secondUpdated = second.coachUpdatedAt ? new Date(second.coachUpdatedAt).getTime() : 0;
    if (firstUpdated !== secondUpdated) return secondUpdated - firstUpdated;
    return `${first.firstName} ${first.lastName}`.localeCompare(`${second.firstName} ${second.lastName}`, coachLanguage);
  });
  byId("athlete-count").textContent = new Intl.NumberFormat(coachLanguage === "fa" ? "fa-IR" : "en").format(visibleAthletes.length);
  byId("coach-athlete-list").innerHTML = visibleAthletes.length
    ? visibleAthletes.map((athlete) => {
      const membership = athlete.subscriptions?.[0];
      const status = membership
        ? membership.status === "active"
          ? `${membership.daysLeft} ${escapeHTML(t("daysLeft"))}`
          : escapeHTML(t("expired"))
        : escapeHTML(t("noSubscription"));
      const membershipLabel = getSubscriptionStatus(athlete);
      const className = membership
        ? coachLanguage === "fa"
          ? membership.classNameFa || membership.classNameEn
          : membership.classNameEn || membership.classNameFa
        : "";
      return `<button class="coach-athlete-card${athlete.id === selectedAthleteId ? " selected" : ""}" type="button" data-athlete-id="${escapeHTML(athlete.id)}">
        <span class="coach-athlete-identity"><span class="coach-athlete-avatar" aria-hidden="true">${escapeHTML(`${athlete.firstName?.[0] || ""}${athlete.lastName?.[0] || ""}`)}</span><span class="coach-athlete-info"><strong class="coach-athlete-name">${escapeHTML(`${athlete.firstName} ${athlete.lastName}`)}</strong><span class="coach-athlete-phone" dir="ltr">${escapeHTML(athlete.phone)}</span></span></span>
        <span class="coach-athlete-membership coach-membership-${membershipLabel}"><strong>${status}</strong>${className ? `<small>${escapeHTML(className)}</small>` : ""}</span>
        <span class="coach-athlete-updated"><span>${escapeHTML(t("lastUpdated"))}</span><time>${escapeHTML(athlete.coachUpdatedAt ? formatCoachUpdateDate(athlete.coachUpdatedAt) : t("notUpdated"))}</time></span>
      </button>`;
    }).join("")
    : `<p class="coach-muted coach-list-empty">${escapeHTML(t("noAthletes"))}</p>`;
  byId("coach-athlete-list").querySelectorAll("[data-athlete-id]").forEach((button) => {
    button.addEventListener("click", () => selectAthlete(button.dataset.athleteId));
  });
}

function renderAthleteDetail() {
  const athlete = athletes.find((item) => item.id === selectedAthleteId);
  if (!athlete) return;
  byId("coach-empty-state").classList.add("hidden");
  byId("coach-athlete-detail").classList.remove("hidden");
  byId("athlete-detail-title").textContent = `${athlete.firstName} ${athlete.lastName}`;
  byId("athlete-phone").textContent = athlete.phone || "";
  const lastUpdated = byId("athlete-last-updated");
  lastUpdated.textContent = `${t("lastUpdated")}: ${formatCoachUpdateDate(athlete.coachUpdatedAt)}`;
  lastUpdated.classList.remove("hidden");
  byId("athlete-subscriptions").innerHTML = athlete.subscriptions?.length
    ? athlete.subscriptions.map((subscription) => {
      const className = coachLanguage === "fa"
        ? subscription.classNameFa || subscription.classNameEn
        : subscription.classNameEn || subscription.classNameFa;
      const status = subscription.status === "active" ? `${subscription.daysLeft} ${t("daysLeft")}` : t("expired");
      const started = subscription.startedAt ? new Date(subscription.startedAt).toLocaleDateString(coachLanguage === "fa" ? "fa-IR" : "en") : "—";
      const ends = subscription.endsAt ? new Date(subscription.endsAt).toLocaleDateString(coachLanguage === "fa" ? "fa-IR" : "en") : "—";
      return `<article class="coach-subscription-card">
        <div class="coach-subscription-heading"><strong>${escapeHTML(className || "Boxing subscription")}</strong><span class="${subscription.status === "active" ? "subscription-active" : "subscription-expired"}">${escapeHTML(status)}</span></div>
        <div class="coach-subscription-days"><strong>${subscription.daysEnrolled}</strong><span>${escapeHTML(t("daysEnrolled"))}</span></div>
        <p>${escapeHTML(t("started"))}: <time>${escapeHTML(started)}</time><span aria-hidden="true"> · </span>${escapeHTML(t("ends"))}: <time>${escapeHTML(ends)}</time></p>
      </article>`;
    }).join("")
    : `<p class="coach-muted">${escapeHTML(t("noSubscription"))}</p>`;

  const form = byId("coach-assessment-form");
  for (const field of ["cardio", "power", "speed", "technique", "defense", "footwork"]) {
    form.elements[field].value = athlete[field] ?? "";
    updateScoreSelect(form.elements[field]);
  }
  form.elements.message.value = athlete.message || "";
}

function selectAthlete(id) {
  selectedAthleteId = id;
  byId("coach-assessment-form").classList.remove("hidden");
  byId("coach-edit-assessment").classList.add("hidden");
  byId("coach-save-result").textContent = "";
  byId("coach-save-result").classList.remove("is-visible", "is-error");
  byId("coach-save-feedback").textContent = "";
  byId("coach-save-feedback").classList.remove("is-visible", "is-error");
  renderAthleteList();
  renderAthleteDetail();
}

async function loadAthletes() {
  byId("athlete-list-feedback").textContent = t("loading");
  try {
    const result = await coachRequest("/api/coach/athletes");
    athletes = result.athletes || [];
    byId("athlete-list-feedback").textContent = "";
    if (!athletes.some((athlete) => athlete.id === selectedAthleteId)) {
      selectedAthleteId = null;
      byId("coach-athlete-detail").classList.add("hidden");
      byId("coach-empty-state").classList.remove("hidden");
    }
    renderAthleteList();
  } catch (error) {
    if (error.status === 401) {
      byId("coach-workspace").classList.add("hidden");
      byId("coach-login-panel").classList.remove("hidden");
      byId("coach-logout").classList.add("hidden");
    }
    byId("athlete-list-feedback").textContent = error.message || t("loadError");
  }
}

byId("coach-language").addEventListener("click", () => {
  setLanguage(coachLanguage === "fa" ? "en" : "fa");
});

byId("coach-assessment-form").querySelectorAll(".coach-score-grid select").forEach((select) => {
  select.addEventListener("change", () => updateScoreSelect(select));
});

byId("coach-login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formElement = event.currentTarget;
  const feedback = byId("coach-login-feedback");
  const button = formElement.querySelector("button[type=submit]");
  feedback.textContent = "";
  button.disabled = true;
  try {
    await coachRequest("/api/coach/login", {
      method: "POST",
      body: JSON.stringify({
        phone: byId("coach-phone").value,
        password: byId("coach-password").value,
      }),
    });
    formElement.reset();
    showCoachWorkspace();
    await loadAthletes();
  } catch (error) {
    feedback.textContent = error.message || t("loginError");
  } finally {
    button.disabled = false;
  }
});

byId("coach-logout").addEventListener("click", async () => {
  try {
    await coachRequest("/api/coach/logout", { method: "POST", body: "{}" });
    athletes = [];
    selectedAthleteId = null;
    byId("coach-workspace").classList.add("hidden");
    byId("coach-login-panel").classList.remove("hidden");
    byId("coach-logout").classList.add("hidden");
  } catch (error) {
    window.alert(error.message || t("logoutError"));
  }
});

byId("athlete-search").addEventListener("input", renderAthleteList);
byId("athlete-filter").addEventListener("change", renderAthleteList);

byId("coach-edit-assessment").addEventListener("click", () => {
  byId("coach-assessment-form").classList.remove("hidden");
  byId("coach-edit-assessment").classList.add("hidden");
  byId("coach-save-result").textContent = "";
  byId("coach-save-result").classList.remove("is-visible", "is-error");
});

byId("coach-assessment-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = byId("coach-save-feedback");
  const button = byId("coach-save-button");
  const scoreFields = ["cardio", "power", "speed", "technique", "defense", "footwork"];
  const scoreValues = scoreFields.map((field) => form.elements[field].value.trim());
  const hasAnyScores = scoreValues.some(Boolean);
  feedback.textContent = "";
  feedback.classList.remove("is-error", "is-visible");
  if (hasAnyScores && scoreValues.some((value) => !value)) {
    feedback.textContent = t("completeScores");
    feedback.classList.add("is-error", "is-visible");
    return;
  }
  const body = { message: form.elements.message.value };
  if (hasAnyScores) {
    scoreFields.forEach((field, index) => { body[field] = Number(scoreValues[index]); });
  }
  if (!hasAnyScores && !body.message.trim()) {
    feedback.textContent = t("emptyUpdate");
    feedback.classList.add("is-error", "is-visible");
    return;
  }
  button.disabled = true;
  feedback.textContent = t("saving");
  feedback.classList.add("is-visible");
  try {
    const updated = await coachRequest(`/api/coach/athletes/${encodeURIComponent(selectedAthleteId)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    const prior = athletes.find((athlete) => athlete.id === selectedAthleteId);
    Object.assign(updated, { subscriptions: prior?.subscriptions || [] });
    athletes = athletes.map((athlete) => athlete.id === selectedAthleteId ? updated : athlete);
    renderAthleteList();
    renderAthleteDetail();
    form.classList.add("hidden");
    byId("coach-edit-assessment").classList.remove("hidden");
    byId("coach-save-result").textContent = t("saved");
    byId("coach-save-result").classList.add("is-visible");
  } catch (error) {
    feedback.textContent = error.message || t("saveError");
    feedback.classList.add("is-error", "is-visible");
    console.error("Coach assessment save failed:", error);
  } finally {
    button.disabled = false;
  }
});

setLanguage("fa");
coachRequest("/api/coach/session")
  .then(async ({ coach }) => {
    if (coach) {
      showCoachWorkspace();
      await loadAthletes();
    }
  })
  .catch((error) => {
    byId("coach-login-feedback").textContent = error.message || t("loginError");
  });
