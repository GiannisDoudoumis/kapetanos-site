const menuBtn = document.getElementById("menuBtn");
const siteNav = document.getElementById("siteNav");
const year = document.getElementById("year");
const langButtons = document.querySelectorAll("[data-lang-set]");
const translatableNodes = document.querySelectorAll("[data-el][data-en]");

const applyLanguage = (lang) => {
  document.documentElement.lang = lang;
  translatableNodes.forEach((node) => {
    const value = node.getAttribute(`data-${lang}`);
    if (value) {
      node.textContent = value;
    }
  });

  langButtons.forEach((button) => {
    const active = button.getAttribute("data-lang-set") === lang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  try {
    localStorage.setItem("siteLang", lang);
  } catch (error) {
    // Ignore storage exceptions in private mode.
  }
};

if (menuBtn && siteNav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.getAttribute("data-lang-set") || "el";
    applyLanguage(lang);
  });
});

let initialLanguage = "el";
try {
  const storedLang = localStorage.getItem("siteLang");
  const urlLang = new URLSearchParams(window.location.search).get("lang");

  if (storedLang === "el" || storedLang === "en") {
    initialLanguage = storedLang;
  } else if (urlLang === "en" || urlLang === "el") {
    initialLanguage = urlLang;
  } else if (navigator.language && navigator.language.toLowerCase().startsWith("en")) {
    initialLanguage = "en";
  }
} catch (error) {
  // Ignore storage exceptions in private mode.
}

// Optimize initial load: if we're already in Greek, avoid scanning/updating all translatable nodes.
document.documentElement.lang = initialLanguage;
langButtons.forEach((button) => {
  const active = button.getAttribute("data-lang-set") === initialLanguage;
  button.classList.toggle("active", active);
  button.setAttribute("aria-pressed", String(active));
});
if (initialLanguage === "en") {
  applyLanguage("en");
}

// Render email from parts (avoids writing a full plain email in HTML).
const emailLink = document.getElementById("emailLink");
const emailText = document.getElementById("emailText");
if (emailLink && emailText) {
  const user = emailLink.getAttribute("data-email-user") || "";
  const domain = emailLink.getAttribute("data-email-domain") || "";
  const email = `${user}@${domain}`;
  emailText.textContent = email;
  emailLink.href = `mailto:${email}`;
}

// ---------------------------
// GA4 Consent Mode (update)
// ---------------------------
let ga4ConsentApplied = false;

const updateGA4Consent = (granted) => {
  if (!window.gtag) return;
  if (ga4ConsentApplied && granted === window.__gaConsentGranted) return;

  ga4ConsentApplied = true;
  window.__gaConsentGranted = granted;

  window.gtag("consent", "update", {
    ad_storage: granted ? "granted" : "denied",
    analytics_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
  });
};

const cookieBanner = document.getElementById("cookieBanner");
if (cookieBanner) {
  const cookieAccept = document.getElementById("cookieAccept");
  const cookieReject = document.getElementById("cookieReject");

  let consent = null;
  try {
    consent = localStorage.getItem("cookieConsent");
  } catch (error) {
    // Ignore storage exceptions in private mode.
  }

  if (consent === "accepted" || consent === "rejected") {
    cookieBanner.classList.add("cookie-hidden");
  }

  const closeWith = (value) => {
    try {
      localStorage.setItem("cookieConsent", value);
    } catch (error) {
      // Ignore storage exceptions in private mode.
    }
    cookieBanner.classList.add("cookie-hidden");
    updateGA4Consent(value === "accepted");
  };

  if (cookieAccept) {
    cookieAccept.addEventListener("click", () => closeWith("accepted"));
  }

  if (cookieReject) {
    cookieReject.addEventListener("click", () => closeWith("rejected"));
  }

  // If user already accepted previously, apply consent state immediately.
  if (consent === "accepted") {
    updateGA4Consent(true);
  }
}

// Google Maps: no iframe — Instagram/in-app browsers block embedded maps (ERR_BLOCKED_BY_RESPONSE).
// Users open the full Google Maps app or browser via the link in index.html.
