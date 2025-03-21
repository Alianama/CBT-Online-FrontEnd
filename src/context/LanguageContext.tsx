import { createContext } from "react";

type LocaleContextType = {
  locale: string;
  toggleLocale: () => void;
};
const defaultValue: LocaleContextType = {
  locale: "id",
  toggleLocale: () => {},
};
const LanguageContext = createContext<LocaleContextType>(defaultValue);
export default LanguageContext;
