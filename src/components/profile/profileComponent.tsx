"use client"
import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Book, Hash, Key, Mail, School, ShieldAlert, User, UserCheck} from "lucide-react"
import {getAuthData} from "@/utils/storage"
import InfoPanel from "@/components/profile/InfoPanel.tsx";

export default function ProfileComponent() {
    const [name, setName] = useState("");
    const [kelas, setKelas] = useState<number | null>(null);
    const [nis, setNis] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [ban, setBan] = useState<number | null>(null);
    const [type, setType] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
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
            const {user_type, id_kelas, nama, nis, ban, username} = userData;
            setName(nama);
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
        <div
            className="bg-secondary p-20 max-md:p-9">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <Card className="lg:col-span-1 border-none shadow-lg overflow-visible">
                        <CardHeader className="relative pt-16 pb-5 flex flex-col items-center">

                            <div
                                className="absolute -top-7 w-24 h-24 rounded-full shadow-xl flex items-center justify-center bg-gradient-to-br from-primary to-indigo-600 text-white text-4xl font-bold select-none transition-transform hover:scale-105 duration-300">
                                {getInitials(name)}
                            </div>

                            <div className="mt-6 w-full text-center">
                                <CardTitle
                                    className="text-2xl font-bold tracking-tight">{name}</CardTitle>
                                <p className="text-muted-foreground mt-1">@{username}</p>

                                <div className="mt-4 flex gap-3 flex-col items-center justify-center">
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
                                    <Badge
                                      className="bg-blue-50 text-blue-700 cursor-pointer border-blue-200 hover:bg-emerald-100 transition-colors duration-300 md:hidden px-3 py-1">
                                        <Key className="h-3.5 w-3.5 mr-1"/> Ubah Password
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-3 mt-2">
                                <div
                                    className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                    <Hash className="h-4 w-4 text-primary mr-3"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">NIS</p>
                                        <p className="font-medium text-black ">{nis}</p>
                                    </div>
                                </div>

                                <div
                                    className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                    <Mail className="h-4 w-4 text-primary mr-3"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Username</p>
                                        <p className="font-medium text-black ">{username}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="lg:col-span-2 border-none shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-semibold flex items-center">
                                <User className="h-5 w-5 text-primary mr-2"/>
                                Informasi Siswa
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <InfoPanel
                                    title="Data Siswa"
                                    items={[
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: "Nama Lengkap",
                                            value: name,
                                        },
                                        {
                                            icon: <Book className="h-4 w-4 text-primary"/>,
                                            label: "Kelas",
                                            value: `Kelas ${kelas}`,
                                        },
                                        {
                                            icon: <School className="h-4 w-4 text-primary"/>,
                                            label: "NIS",
                                            value: nis,
                                        },
                                    ]}
                                />

                                <InfoPanel
                                    title="Data Akun"
                                    items={[
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: "Username",
                                            value: username,
                                        },
                                        {
                                            icon: <UserCheck className="h-4 w-4 text-primary"/>,
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
    )
}


