import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Book, Hash, Mail, School, ShieldAlert, Type, User, UserCheck} from "lucide-react";
import InfoPanel from "@/components/profile/InfoPanel.tsx";
import {useGlobal} from "@/context/GlobalContext.tsx";
import LangContext from "@/context/LangContext.tsx";
import {useContext} from "react";
import ChangePassword from "@/components/profile/change-password.tsx";
import UpdateBiodata from "@/components/profile/update-biodata.tsx";

export default function ProfileComponent() {
    const {user, biodata, generalUser, loading} = useGlobal();
    const {locale} = useContext(LangContext);
    const translations = {
        id: {
            userNotFound: "Data pengguna tidak ditemukan.",
            loading: "Memuat...",
            active: "Aktif",
            blocked: "Diblokir",
            changePassword: "Ubah Password",
            studentInfo: "Informasi Siswa",
            studentData: "Data Siswa",
            accountData: "Data Akun",
            fullName: "Nama Lengkap",
            class: "Kelas",
            nis: "NIS",
            username: "Username",
            userType: "Tipe User",
            angkatan: "Angkatan",
        },
        en: {
            userNotFound: "User data not found.",
            loading: "Loading...",
            active: "Active",
            blocked: "Blocked",
            changePassword: "Change Password",
            studentInfo: "Student Information",
            studentData: "Student Data",
            accountData: "Account Data",
            fullName: "Full Name",
            class: "Class",
            nis: "Student ID",
            username: "Username",
            userType: "User Type",
            angkatan: "Generation",
        },
    };
    const t = translations[locale as keyof typeof translations];
    if (loading) {
        return <p className="text-center p-5">{t.loading}</p>;
    }
    if (!user) {
        return <p className="text-center p-5">{t.userNotFound}</p>;
    }
    return (
        <div className="bg-secondary p-20 max-md:p-9">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 border-none shadow-lg overflow-visible">
                        <CardHeader className="relative pt-16 pb-5 flex flex-col items-center">
                            <div
                                className="absolute -top-7 w-24 h-24 rounded-full shadow-xl flex items-center justify-center bg-gradient-to-br from-primary to-indigo-600 text-white text-4xl font-bold select-none transition-transform hover:scale-105 duration-300"
                                style={{
                                    backgroundImage: `url(${generalUser?.picture})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}>
                            </div>
                            <div className="mt-6 w-full text-center">
                                <CardTitle className="text-2xl font-bold tracking-tight">{user.nama}</CardTitle>
                                <p className="text-muted-foreground mt-1">@{user.username}</p>

                                <div className="mt-4 flex gap-3 flex-col items-center justify-center">
                                    {user.ban === 0 ? (
                                        <Badge
                                            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors duration-300 px-3 py-1">
                                            <UserCheck className="h-3.5 w-3.5 mr-1"/> {t.active}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline"
                                               className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
                                            <ShieldAlert className="h-3.5 w-3.5 mr-1"/> {t.blocked}
                                        </Badge>
                                    )}
                                    <div className="flex flex-col gap-3">

                                        <ChangePassword/>
                                        <UpdateBiodata/>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-3 mt-2">
                                <div
                                    className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                    <Hash className="h-4 w-4 text-primary mr-3"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t.nis}</p>
                                        <p className="font-medium text-black ">{user.nis}</p>
                                    </div>
                                </div>

                                <div
                                    className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                    <Mail className="h-4 w-4 text-primary mr-3"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t.username}</p>
                                        <p className="font-medium text-black ">{user.username}</p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                    <Type className="h-4 w-4 text-primary mr-3"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t.userType}</p>
                                        <p className="font-medium text-black ">{generalUser?.user_type}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 border-none shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-semibold flex items-center">
                                <User className="h-5 w-5 text-primary mr-2"/>
                                {t.studentInfo}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <InfoPanel
                                    title={t.studentData}
                                    items={[
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.fullName,
                                            value: user.nama,
                                        },
                                        {
                                            icon: <Book className="h-4 w-4 text-primary"/>,
                                            label: t.class,
                                            value: ` ${t.class} ${user.nama_kelas}`,
                                        },
                                        {
                                            icon: <School className="h-4 w-4 text-primary"/>,
                                            label: t.nis,
                                            value: user.nis,
                                        },
                                        {
                                            icon: <School className="h-4 w-4 text-primary"/>,
                                            label: t.angkatan,
                                            value: `${user.angkatan}`,
                                        },
                                    ]}
                                />
                                <InfoPanel
                                    title={t.studentData}
                                    items={[
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.tempatLahir,
                                            value: biodata?.tempat_lahir ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.tanggalLahir,
                                            value: biodata?.tanggal_lahir ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.nis,
                                            value: biodata?.jenis_kelamin ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.province,
                                            value: biodata?.provinsi ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.city,
                                            value: biodata?.kota ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.district,
                                            value: biodata?.kecamatan ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.village,
                                            value: biodata?.kelurahan ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.address,
                                            value: biodata?.alamat ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.phoneNumber,
                                            value: biodata?.no_hp ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.hobby,
                                            value: biodata?.hobi ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.ambition,
                                            value: biodata?.cita ?? "",
                                        },
                                        {
                                            icon: <User className="h-4 w-4 text-primary"/>,
                                            label: t.motto,
                                            value: biodata?.motto ?? "",
                                        },
                                    ]}
                                />

                            </div>

                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
