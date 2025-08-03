import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function useLanguageDebug() {
  const { language } = useLanguage();

  useEffect(() => {
    console.log("=== LANGUAGE DEBUG ===");
    console.log("Current language:", language);
    console.log(
      "localStorage value:",
      localStorage.getItem("transfermarbell_language"),
    );
    console.log(
      "sessionStorage value:",
      sessionStorage.getItem("current_language"),
    );
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("===================");
  }, [language]);

  // Function to manually clear all language storage
  const clearLanguageStorage = () => {
    localStorage.removeItem("transfermarbell_language");
    localStorage.removeItem("user_language_preference");
    sessionStorage.removeItem("current_language");
    console.log("All language storage cleared");
  };

  // Function to set language directly in storage
  const forceSetLanguage = (lang: string) => {
    localStorage.setItem("transfermarbell_language", lang);
    console.log("Language forced to:", lang);
    window.location.reload();
  };

  return {
    clearLanguageStorage,
    forceSetLanguage,
  };
}
