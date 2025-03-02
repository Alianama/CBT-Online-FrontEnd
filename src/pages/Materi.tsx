import Layout from "@/components/Layout"
import LangContext from "@/context/LangContext.tsx";
import {useContext} from "react";

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
        <Layout data={locale === "id" ? [pagedata.id ]: [pagedata.en]}>
            <title>Materi</title>
            <div>Home</div>
        </Layout>
    )
}
