import Layout from "@/components/sidebar/Layout.tsx"
import LangContext from "@/context/LangContext.tsx";
import {useContext} from "react";
import LessonComponent from "@/components/lesson/LessonComponent.tsx";

export default function Materi() {
    const {locale} = useContext(LangContext);
    const pagedata = {
        id: {
            name: "Materi",
            url: "/materi",
        },
        en: {
            name: "Lesson",
            url: "/materi",
        }
    }
    return (
        <Layout data={locale === "id" ? [pagedata.id] : [pagedata.en]}>
            <LessonComponent/>
        </Layout>
    )
}
