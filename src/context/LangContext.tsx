import { createContext } from "react";

type LocaleContextType = {
  locale: string;
  toggleLocale: () => void;
};
const defaultValue: LocaleContextType = {
  locale: "id",
  toggleLocale: () => {},
};
const LangContext = createContext<LocaleContextType>(defaultValue);
export default LangContext;
