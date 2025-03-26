import Layout from "@/components/sidebar/Layout.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
    AlertCircle,
    Book, CalendarDays, GraduationCap,
    Hash,
    House,
    Mail, MapPinHouse, PhoneCall,
    School,
    ShieldAlert, Smile,
    Type,
    User,
    UserCheck,
    UserRoundPen, Volleyball
} from "lucide-react";
import InfoPanel from "@/components/profile/info-panel.tsx";
import {useGlobal} from "@/context/GlobalContext.tsx";
import LanguageContext from "@/context/LanguageContext.tsx";
import {useContext} from "react";
import ChangePassword from "@/components/profile/change-password.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "@/components/ui/skeleton.tsx";

export default function ProfilPage() {
    const {user, generalUser, biodata, loading} = useGlobal();
    const {locale} = useContext(LanguageContext);
    const pagedata = {
        id: {name: "Profil", url: "/profile"},
        en: {name: "Profile", url: "/profile"},
    };
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
            tempatLahir: "Tempat Lahir",
            tanggalLahir: "Tanggal Lahir",
            province: "Provinsi",
            city: "Kota",
            district: "Kecamatan",
            village: "Kelurahan",
            address: "Alamat",
            phoneNumber: "Nomor HP",
            hobby: "Hobi",
            ambition: "Cita-cita",
            motto: "Motto",
            alert: "Kamu belum melengkapi biodata. Silakan lengkapi biodata terlebih dahulu.",
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
            tempatLahir: "Place of Birth",
            tanggalLahir: "Date of Birth",
            province: "Province",
            city: "City",
            district: "District",
            village: "Village",
            address: "Address",
            phoneNumber: "Phone Number",
            hobby: "Hobby",
            ambition: "Ambition",
            motto: "Motto",
            alert: "You haven't completed your profile. Please complete your biodata first."
        },
    }
    const navigate = useNavigate();
    const t = translations[locale as keyof typeof translations];
    if (loading) {
        return <Layout data={locale === "id" ? [pagedata.id] : [pagedata.en]}>
            <div className="flex w-full gap-10 max-md:flex-col h-screen">
                <Skeleton className="h-1/2 w-1/2 max-md:w-full rounded-xl"/>
                <Skeleton className="h-1/2 w-1/2 max-md:w-full rounded-xl"/>
            </div>
        </Layout>;
    }
    return (
        <Layout data={locale === "id" ? [pagedata.id] : [pagedata.en]}>


            {
                biodata?.tempat_lahir === null ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Warning!!</AlertTitle>
                        <AlertDescription>
                            {t.alert}
                        </AlertDescription>
                    </Alert>
                ) : null}

            <div className="p-10 bg-neutral-100 dark:bg-neutral-800 ">
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1 border-none shadow-lg ">
                            <CardHeader className="relative pt-16 pb-5 flex flex-col items-center">
                                <div
                                    className="absolute -top-7 w-24 h-24 rounded-full shadow-xl flex items-center justify-center bg-gradient-to-br from-primary to-indigo-600 text-white text-4xl font-bold select-none transition-transform hover:scale-105 duration-300"
                                    style={{
                                        backgroundImage: `url(${generalUser?.picture})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                ></div>
                                <div className="mt-6 w-full text-center">
                                    <CardTitle className="text-lg font-bold tracking-tight">
                                        {user?.nama}
                                    </CardTitle>
                                    <p className="text-muted-foreground mt-1">
                                        @{user?.username}
                                    </p>

                                    <div className="mt-4 flex gap-3 flex-col items-center justify-center">
                                        {user?.ban === 0 ? (
                                            <Badge
                                                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors duration-300 px-3 py-1">
                                                <UserCheck className="h-3.5 w-3.5 mr-1"/> {t.active}
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="bg-red-50 text-red-700 border-red-200 px-3 py-1"
                                            >
                                                <ShieldAlert className="h-3.5 w-3.5 mr-1"/> {t.blocked}
                                            </Badge>
                                        )}
                                        <div className="flex flex-col max-md:flex-row gap-3">
                                            <ChangePassword/>
                                            <Badge
                                                onClick={() => navigate(`/update-profile`)}
                                                className="bg-blue-50 text-green-600 cursor-pointer border-blue-200 hover:bg-emerald-100 transition-colors duration-300 px-3 py-1"
                                            >
                                                <UserRoundPen className="h-3.5 w-3.5 mr-1"/> Update Biodata
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3 mt-2">
                                    <div
                                        className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                        <Hash className="h-4 w-4 dark:text-neutral-800 text-primary mr-3"/>
                                        <div>
                                            <p className="text-xs text-muted-foreground">{t.nis}</p>
                                            <p className="font-medium text-sm text-black ">{user?.nis}</p>
                                        </div>
                                    </div>

                                    <div
                                        className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                        <Mail className="h-4 w-4 dark:text-neutral-800 text-primary mr-3"/>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t.username}
                                            </p>
                                            <p className="font-medium text-sm text-black ">
                                                {user?.username}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                        <Type className="h-4 w-4 dark:text-neutral-800 text-primary mr-3"/>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t.userType}
                                            </p>
                                            <p className="font-medium text-sm text-black ">
                                                {generalUser?.user_type}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                        <School className="h-4 w-4 dark:text-neutral-800 text-primary mr-3"/>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t.angkatan}
                                            </p>
                                            <p className="font-medium text-sm text-black ">
                                                {user?.angkatan}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                        <Book className="h-4 w-4 dark:text-neutral-800 text-primary mr-3"/>
                                        <div>
                                            <p className="text-xs text-muted-foreground">{t.class}</p>
                                            <p className="font-medium text-sm text-black ">
                                                {` ${t.class} ${user?.nama_kelas}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2 border-none shadow-lg">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <User className="h-5 w-5 text-primary mr-2"/>
                                    {t.studentInfo}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex max-md:flex-col gap-10">
                                    <InfoPanel
                                        title="Biodata"
                                        items={[
                                            {
                                                icon: <PhoneCall className="h-4 w-4 text-primary"/>,
                                                label: t.phoneNumber,
                                                value: biodata?.no_hp ?? "",
                                            },
                                            {
                                                icon: <CalendarDays className="h-4 w-4 text-primary"/>,
                                                label: t.tanggalLahir,
                                                value: biodata?.tanggal_lahir ?? "",
                                            },
                                            {
                                                icon: <MapPinHouse className="h-4 w-4 text-primary"/>,
                                                label: t.tempatLahir,
                                                value: biodata?.tempat_lahir ?? "",
                                            },
                                            {
                                                icon: <Volleyball className="h-4 w-4 text-primary"/>,
                                                label: t.hobby,
                                                value: biodata?.hobi ?? "",
                                            },
                                            {
                                                icon: <GraduationCap className="h-4 w-4 text-primary"/>,
                                                label: t.ambition,
                                                value: biodata?.cita ?? "",
                                            },
                                            {
                                                icon: <Smile className="h-4 w-4 text-primary"/>,
                                                label: t.motto,
                                                value: biodata?.motto ?? "",
                                            },
                                        ]}
                                    />
                                    <InfoPanel
                                        title="Alamat"
                                        items={[
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.province,
                                                value: biodata?.provinsi ?? "",
                                            },
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.city,
                                                value: biodata?.kota ?? "",
                                            },
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.district,
                                                value: biodata?.kecamatan ?? "",
                                            },
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.village,
                                                value: biodata?.kelurahan ?? "",
                                            },
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.address,
                                                value: biodata?.alamat ?? "",
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
    );
}
