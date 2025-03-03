import {useEffect, useState} from "react";
import Layout from "@/components/sidebar/Layout.tsx";

const data = [
    {id: 1, name: "Alice"},
    {id: 2, name: "Bob"},
    {id: 3, name: "Charlie"},
    {id: 4, name: "David"},
    {id: 5, name: "Eve"}
];
const pagedata = {
    name: "Ujian",
    url: "/ujian",
}
export default function Exam() {
    const [randomData, setRandomData] = useState(data);
    useEffect(() => {
        setRandomData([...data].sort(() => Math.random() - 0.5));
    }, []);
    return (
        <Layout data={[pagedata]}>
            <ul>
                {randomData.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </Layout>
    );
}
