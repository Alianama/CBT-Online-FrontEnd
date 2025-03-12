import Layout from "@/components/sidebar/Layout.tsx";
import {useContext, useEffect, useState} from "react";
import LangContext from "@/context/LangContext.tsx";
import {getUserById} from "@/app/api/api-cbt.ts";
import {getAuthData} from "@/utils/storage.ts";

export default function Profile() {
    const {locale} = useContext(LangContext);
    const user_id = getAuthData()?.userData?.user_id ?? null;
    const [name, setName] = useState<string>();
    const [kelas, setKelas] = useState<string>();
    const [nis, setNis] = useState<number>();
    const [username, setUsername] = useState<string>();
    const [ban, setBan] = useState<string>();
    const pagedata = {
        id: {
            name: "Profil",
            url: "/profile",
        },
        en: {
            name: "Profile",
            url: "/profile",
        }
    }
    useEffect(() => {
        (async () => {
                try {
                    const response = await getUserById(user_id);
                    if (response) {
                        const {id_kelas, nama_siswa, nis, ban, username} = response;
                        setName(nama_siswa);
                        setKelas(id_kelas);
                        setNis(nis);
                        setUsername(username);
                        setBan(ban);
                    } else {
                        console.log(response);
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        )();
    })
    return (
        <Layout data={locale === "id" ? [pagedata.id] : [pagedata.en]}>
            <div>
                <h1>{name}</h1>

            </div>
        </Layout>
    )
}