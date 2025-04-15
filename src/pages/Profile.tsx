import Layout from "@/components/sidebar/Layout.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
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
import {useContext, useState} from "react";
import ChangePassword from "@/components/profile/change-password.tsx";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import ProfileAlert from "@/components/profile/profile-alert.tsx"
import ChangeProfileImage from "@/components/profile/ChangeProfileImage.tsx";
import {useTranslation} from "@/hooks/useTranslation.ts";

export default function ProfilPage() {
    const {user, biodata, userPicture, loading} = useGlobal();
    const [isChangeProfile, setIsChangeProfile] = useState(false);
    const {locale} = useContext(LanguageContext);
    const t = useTranslation();
    const pagedata = {
        id: {name: "Profil", url: "/profile"},
        en: {name: "Profile", url: "/profile"},
    };
    const navigate = useNavigate();
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

            <ProfileAlert biodata={biodata}/>
            <div className="p-10 bg-neutral-100 dark:bg-neutral-800 ">
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1 border-none shadow-lg ">
                            <CardHeader className="relative pt-16 pb-5 flex flex-col items-center">
                                <div onClick={() => setIsChangeProfile(true)}
                                     className="absolute -top-7 w-24 h-24 rounded-full shadow-xl flex items-center justify-center bg-gradient-to-br from-primary to-indigo-600 text-white text-4xl font-bold select-none transition-transform hover:scale-105 duration-300"
                                     style={{
                                         backgroundImage: `url(${userPicture})`,
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
                                                    <UserCheck className="h-3.5 w-3.5 mr-1"/> {t.profilPage.active}
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="bg-red-50 text-red-700 border-red-200 px-3 py-1"
                                            >
                                                <ShieldAlert className="h-3.5 w-3.5 mr-1"/> {t.profilPage.blocked}
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
                                            <p className="text-xs text-muted-foreground">{t.profilPage.nis}</p>
                                            <p className="font-medium text-sm text-black ">{user?.nis}</p>
                                        </div>
                                    </div>

                                    <div
                                        className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                        <Mail className="h-4 w-4 dark:text-neutral-800 text-primary mr-3"/>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t.profilPage.username}
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
                                                {t.profilPage.userType}
                                            </p>
                                            <p className="font-medium text-sm text-black ">
                                                {user?.user_type}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                        <School className="h-4 w-4 dark:text-neutral-800 text-primary mr-3"/>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t.profilPage.angkatan}
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
                                            <p className="text-xs text-muted-foreground">{t.profilPage.class}</p>
                                            <p className="font-medium text-sm text-black ">
                                                {` ${t.profilPage.class} ${user?.nama_kelas}`}
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
                                    {t.profilPage.studentInfo}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex max-md:flex-col gap-10">
                                    <InfoPanel
                                        title="Biodata"
                                        items={[
                                            {
                                                icon: <PhoneCall className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.phoneNumber,
                                                value: biodata?.no_hp ?? "",
                                            },
                                            {
                                                icon: <CalendarDays className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.tanggalLahir,
                                                value: biodata?.tanggal_lahir ?? "",
                                            },
                                            {
                                                icon: <MapPinHouse className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.tempatLahir,
                                                value: biodata?.tempat_lahir ?? "",
                                            },
                                            {
                                                icon: <Volleyball className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.hobby,
                                                value: biodata?.hobi ?? "",
                                            },
                                            {
                                                icon: <GraduationCap className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.ambition,
                                                value: biodata?.cita ?? "",
                                            },
                                            {
                                                icon: <Smile className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.motto,
                                                value: biodata?.motto ?? "",
                                            },
                                        ]}
                                    />
                                    <InfoPanel
                                        title="Alamat"
                                        items={[
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.province,
                                                value: biodata?.provinsi ?? "",
                                            },
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.city,
                                                value: biodata?.kota ?? "",
                                            },
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.district,
                                                value: biodata?.kecamatan ?? "",
                                            },
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.village,
                                                value: biodata?.kelurahan ?? "",
                                            },
                                            {
                                                icon: <House className="h-4 w-4 text-primary"/>,
                                                label: t.profilPage.address,
                                                value: biodata?.alamat ?? "",
                                            },
                                        ]}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <ChangeProfileImage picture={userPicture} isChangeProfile={isChangeProfile}
                                    setIsChangeProfile={setIsChangeProfile}/>

            </div>
        </Layout>
    );
}
