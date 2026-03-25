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
  } else if (navigator.language && navigator.language.toLowerCase().startsWith("en")) {
    initialLanguage = "en";
  }
} catch (error) {
  // Ignore storage exceptions in private mode.
}

applyLanguage(initialLanguage);

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
  };

  if (cookieAccept) {
    cookieAccept.addEventListener("click", () => closeWith("accepted"));
  }

  if (cookieReject) {
    cookieReject.addEventListener("click", () => closeWith("rejected"));
  }
}
