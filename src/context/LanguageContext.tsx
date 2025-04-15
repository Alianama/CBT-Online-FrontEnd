import { createContext } from "react";

type LocaleContextType = {
  locale: string;
  toggleLocale: () => void;
};
const defaultLang = navigator.language.startsWith("id") ? "id" : "en";
const defaultValue: LocaleContextType = {
  locale: defaultLang,
  toggleLocale: () => {},
};
const LanguageContext = createContext<LocaleContextType>(defaultValue);
export default LanguageContext;
