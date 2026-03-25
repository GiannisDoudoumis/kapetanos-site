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

// Load Google Maps iframe automatically when the contact section is reached.
const loadMapBtn = document.getElementById("loadMapBtn");
const mapContainer = document.getElementById("mapContainer");
const contactSection = document.getElementById("contact");

if (mapContainer) {
  const mapSrc =
    "https://www.google.com/maps?q=Kapetanou+D.+Bros+O.E.+Schinochori+212+00+Greece&output=embed";

  let mapLoaded = false;

  const loadMap = () => {
    if (mapLoaded) return;
    if (mapContainer.querySelector("iframe")) {
      mapLoaded = true;
      return;
    }

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
    mapLoaded = true;

    if (loadMapBtn) {
      loadMapBtn.classList.add("cookie-hidden");
    }
  };

  // User-friendly: if someone clicks, load immediately.
  if (loadMapBtn) {
    loadMapBtn.addEventListener("click", loadMap);
  }

  // Performance-friendly: auto-load only when section becomes visible.
  if (contactSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMap();
            observer.disconnect();
          }
        });
      },
      { root: null, threshold: 0.15 }
    );
    observer.observe(contactSection);
  } else {
    // Fallback: load after a short delay.
    window.setTimeout(loadMap, 1500);
  }
}

// Image performance: decode async (doesn't change layout), keep hero image priority.
document.querySelectorAll("img").forEach((img) => {
  if (!img.decoding) {
    img.decoding = "async";
  }
  if (img.getAttribute("src") && img.getAttribute("src").includes("/images/logo/company-logo")) {
    img.fetchPriority = "high";
  }
});
