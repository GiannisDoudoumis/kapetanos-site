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
  if (storedLang === "el" || storedLang === "en") {
    initialLanguage = storedLang;
  } else {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang === "en" || urlLang === "el") {
      initialLanguage = urlLang;
    }
  } else if (navigator.language && navigator.language.toLowerCase().startsWith("en")) {
    initialLanguage = "en";
  }
} catch (error) {
  // Ignore storage exceptions in private mode.
}

applyLanguage(initialLanguage);

// ---------------------------
// GA4 (free) with consent gate
// ---------------------------
const GA_MEASUREMENT_ID = "G-JQRC04HSDG";
let ga4Initialized = false;
let ga4ConsentApplied = false;

const initGA4ConsentMode = () => {
  if (ga4Initialized) return;
  ga4Initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  // Inject gtag.js early so Google can detect it.
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());

  // Default consent: denied until user accepts.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
  });
};

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

// Initialize GA4 consent mode immediately (with denied defaults).
initGA4ConsentMode();

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

// Lazy-load Google Maps iframe after user action.
const loadMapBtn = document.getElementById("loadMapBtn");
const mapContainer = document.getElementById("mapContainer");

if (loadMapBtn && mapContainer) {
  const mapSrc =
    "https://www.google.com/maps?q=%CE%A3%CF%87%CE%B9%CE%BD%CE%BF%CF%87%CF%8E%CF%81%CE%B9%20212%2000&output=embed";

  loadMapBtn.addEventListener("click", () => {
    if (mapContainer.querySelector("iframe")) return;

    const iframe = document.createElement("iframe");
    iframe.title = "Google Maps ELATOS";
    iframe.loading = "lazy";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.src = mapSrc;
    iframe.setAttribute("aria-label", "Google Maps");
    iframe.setAttribute("allow", "fullscreen");

    mapContainer.innerHTML = "";
    mapContainer.appendChild(iframe);
    mapContainer.setAttribute("aria-hidden", "false");
  });
}
