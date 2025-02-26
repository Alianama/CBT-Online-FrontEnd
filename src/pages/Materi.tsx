import Layout from "@/components/Layout"

export default function Materi() {
    const pagedata = {
        name: "Materi",
        url: "/materi",
    }
    return (
        <Layout data={[pagedata]}>
            <div>Home</div>
        </Layout>
    )
}
