import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome to my app",
      description: "This is a simple example"
    }
  },
  ar: {
    translation: {
      welcome: "مرحبا بك في تطبيقي",
      description: "هذا مثال بسيط"
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next) // Connect with React
  .init({
    resources,
    lng: "en",             // default language
    fallbackLng: "en",     // fallback language
    interpolation: { escapeValue: false }
  });

export default i18n;
