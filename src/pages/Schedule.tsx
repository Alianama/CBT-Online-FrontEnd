import Layout from "@/components/sidebar/Layout.tsx";
import CalendarDemo from "@/components/calendar-page.tsx";

export default function Schedule() {
    const pagedata = {
        name: "Schedule",
        url: "/schedule",
    }
    return (
        <Layout data={[pagedata]}>

            <CalendarDemo/>
        </Layout>
    )
}