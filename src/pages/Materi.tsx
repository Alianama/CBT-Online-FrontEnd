import Layout from "@/components/Layout"

export default function Materi() {
    const pagedata = {
        name: "Materi",
        url: "/materi",
    }
    return (
        <Layout data={[pagedata]}>
            <title>Materi</title>
            <div>Home</div>
        </Layout>
    )
}
