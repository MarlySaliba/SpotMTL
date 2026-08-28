import { useEffect, useMemo, useState } from "react";
import LanguageContext from "./language-context";

const LANGUAGE_STORAGE_KEY = "spotmtl.language";

const siteDescriptions = {
  fr: "Découvrez des attractions, des activités et des restaurants à Montréal avec SpotMTL.",
  en: "Discover attractions, activities, and restaurants in Montréal with SpotMTL.",
};

function getInitialLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en"
      ? "en"
      : "fr";
  } catch {
    return "fr";
  }
}

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language === "fr" ? "fr-CA" : "en-CA";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", siteDescriptions[language]);

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The selected language still works for this visit if storage is blocked.
    }
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () =>
        setLanguage((currentLanguage) =>
          currentLanguage === "fr" ? "en" : "fr",
        ),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
