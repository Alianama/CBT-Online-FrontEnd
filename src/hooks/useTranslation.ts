import en from "@/lang/en.json";
import id from "@/lang/id.json";
import {useContext} from "react";
import LanguageContext from "@/context/LanguageContext.tsx";
import { Translation } from "@/types/translation";

const resources: Record<"en" | "id", Translation>  = {
    en,
    id
};

export const useTranslation = () => {
    const { locale } = useContext(LanguageContext);
    return resources[locale as "en" | "id"];
};
    