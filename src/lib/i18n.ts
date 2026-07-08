import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import cs from "@/locales/cs/common.json";

export const defaultNS = "common";

export const resources = {
  cs: {
    [defaultNS]: cs,
  },
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: "cs",
    fallbackLng: "cs",
    ns: [defaultNS],
    defaultNS,
    resources,
    interpolation: {
      // React already escapes rendered values.
      escapeValue: false,
    },
    returnNull: false,
  });
}

export default i18n;
