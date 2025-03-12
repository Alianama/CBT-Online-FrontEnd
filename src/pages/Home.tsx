import Layout from "@/components/sidebar/Layout.tsx"
import {useContext} from "react";
import LangContext from "@/context/LangContext.tsx";

export default function Home() {
    const {locale} = useContext(LangContext);
    const pagedata = {
        id: {
            name: "Beranda",
            url: "/",
        },
        en: {
            name: "Home",
            url: "/",
        }
    }
    return (
        <Layout data={locale === "id" ? [pagedata.id] : [pagedata.en]}>
            <title>Home</title>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50"/>
                    <div className="aspect-video rounded-xl bg-muted/50"/>
                    <div className="aspect-video rounded-xl bg-muted/50"/>
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
            </div>
        </Layout>
    )
}
