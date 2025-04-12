import Layout from "@/components/sidebar/Layout.tsx";
import {useContext} from "react";
import LanguageContext from "@/context/LanguageContext.tsx";
import ScheduleList from "@/components/exam/ScheduleList.tsx";

type Locale = "id" | "en";
const pageMeta: Record<Locale, { name: string; url: string }> = {
    id: {
        name: "Ujian",
        url: "/ujian",
    },
    en: {
        name: "Exam",
        url: "/exam",
    },
};
export default function Exam() {
    const {locale} = useContext(LanguageContext);
    const pagedata = pageMeta[(locale as Locale) || "id"];
    return (
        <Layout data={[pagedata]}>
            <ScheduleList/>
        </Layout>
    );
}
