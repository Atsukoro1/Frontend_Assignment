import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sk from "@/locales/sk/common.json";

export const defaultNS = "common";

export const resources = {
  sk: {
    [defaultNS]: sk,
  },
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: "sk",
    fallbackLng: "sk",
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
