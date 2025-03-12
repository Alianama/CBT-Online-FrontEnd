"use client"
import React, {useContext, useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Book, Hash, Mail, School, ShieldAlert, User, UserCheck} from "lucide-react"
import {getAuthData} from "@/utils/storage"
import LangContext from "@/context/LangContext.tsx"
import Layout from "@/components/sidebar/Layout.tsx"

export default function ProfilePage() {
    const {locale} = useContext(LangContext);
    const [name, setName] = useState("");
    const [kelas, setKelas] = useState<number | null>(null);
    const [nis, setNis] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [ban, setBan] = useState<number | null>(null);
    const [type, setType] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const pagedata = {
        id: {name: "Profil", url: "/profile"},
        en: {name: "Profile", url: "/profile"}
    };
    useEffect(() => {
        setMounted(true);
        const authData = getAuthData();
        if (!authData || !authData.userData) {
            console.error("User data not found");
            return;
        }
        let userData;
        try {
            userData = typeof authData.userData === "object"
                ? authData.userData
                : JSON.parse(authData.userData);
            if (!userData || typeof userData !== "object") {
                console.error("Invalid User data");
            }
            const {user_type, id_kelas, nama_siswa, nis, ban, username} = userData;
            setName(nama_siswa);
            setKelas(id_kelas);
            setNis(nis);
            setUsername(username);
            setBan(ban);
            setType(user_type);
        } catch (error) {
            console.error("Failed to parse user data:", error);
        }
    }, []);
    if (!mounted) return null;
    const getInitials = (name: string) => {
        const words = name.split(" ");
        return words.length === 1
            ? name.charAt(0).toUpperCase()
            : (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };
    if (!mounted) return null
    return (
        <Layout data={locale === "id" ? [pagedata.id] : [pagedata.en]}>
            <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen pt-10 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <Card className="lg:col-span-1 border-none shadow-lg overflow-visible">
                            <CardHeader className="relative pt-16 pb-5 flex flex-col items-center">

                                <div
                                    className="absolute -top-7 w-24 h-24 rounded-full shadow-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-4xl font-bold select-none transition-transform hover:scale-105 duration-300">
                                    {getInitials(name)}
                                </div>

                                <div className="mt-6 w-full text-center">
                                    <CardTitle
                                        className="text-2xl font-bold tracking-tight">{name}</CardTitle>
                                    <p className="text-muted-foreground mt-1">@{username}</p>

                                    <div className="mt-4 flex justify-center">
                                        {ban === 0 ? (
                                            <Badge
                                                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors duration-300 px-3 py-1">
                                                <UserCheck className="h-3.5 w-3.5 mr-1"/> Aktif
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline"
                                                   className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
                                                <ShieldAlert className="h-3.5 w-3.5 mr-1"/> Diblokir
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3 mt-2">
                                    <div
                                        className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                        <Hash className="h-4 w-4 text-indigo-500 mr-3"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">NIS</p>
                                            <p className="font-medium">{nis}</p>
                                        </div>
                                    </div>

                                    <div
                                        className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                        <Mail className="h-4 w-4 text-indigo-500 mr-3"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Username</p>
                                            <p className="font-medium">{username}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Details Card */}
                        <Card className="lg:col-span-2 border-none shadow-lg">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-semibold flex items-center">
                                    <User className="h-5 w-5 text-indigo-500 mr-2"/>
                                    Informasi Siswa
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <InfoPanel
                                        title="Data Siswa"
                                        items={[
                                            {
                                                icon: <User className="h-4 w-4 text-indigo-500"/>,
                                                label: "Nama Lengkap",
                                                value: name,
                                            },
                                            {
                                                icon: <Book className="h-4 w-4 text-indigo-500"/>,
                                                label: "Kelas",
                                                value: `Kelas ${kelas}`,
                                            },
                                            {
                                                icon: <School className="h-4 w-4 text-indigo-500"/>,
                                                label: "NIS",
                                                value: nis,
                                            },
                                        ]}
                                    />

                                    <InfoPanel
                                        title="Data Akun"
                                        items={[
                                            {
                                                icon: <User className="h-4 w-4 text-indigo-500"/>,
                                                label: "Username",
                                                value: username,
                                            },
                                            {
                                                icon: <UserCheck className="h-4 w-4 text-indigo-500"/>,
                                                label: "Tipe User",
                                                value: `${type} Siswa `,
                                            },
                                        ]}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

function InfoPanel({title, items}: {
    title: string
    items: { icon: React.ReactNode; label: string; value: string }[]
}) {
    return (
        <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">{title}</h3>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-100 transition-colors duration-200"
                    >
                        <div className="bg-indigo-50 p-2 rounded-md">{item.icon}</div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                            <p className="font-medium">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

