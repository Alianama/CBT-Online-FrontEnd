import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Book, Hash, Key, Mail, School, ShieldAlert, Type, User, UserCheck} from "lucide-react";
import InfoPanel from "@/components/profile/InfoPanel.tsx";
import { useUser } from "@/context/UserContext.tsx";
import LangContext from "@/context/LangContext.tsx";
import {Input} from "@/components/ui/input.tsx";
import { useRef, useContext } from "react";

export default function ProfileComponent() {
    const passwordRef = useRef<HTMLDivElement | null>(null);
    const { user, generalUser, loading } = useUser();
    const { locale } = useContext(LangContext);

    const translations  = {
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

    const scrollToPassword = () => {
        passwordRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return (
      <div className="bg-secondary p-20 max-md:p-9">
          <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1 border-none shadow-lg overflow-visible">
                      <CardHeader className="relative pt-16 pb-5 flex flex-col items-center">
                          <div className="absolute -top-7 w-24 h-24 rounded-full shadow-xl flex items-center justify-center bg-gradient-to-br from-primary to-indigo-600 text-white text-4xl font-bold select-none transition-transform hover:scale-105 duration-300"
                               style={{
                                   backgroundImage: `url(${generalUser?.picture})`,
                                   backgroundSize: "cover",
                                   backgroundPosition: "center",
                               }}>
                          </div>
                          <div className="mt-6 w-full text-center">
                              <CardTitle className="text-2xl font-bold tracking-tight">{user.nama_siswa}</CardTitle>
                              <p className="text-muted-foreground mt-1">@{user.username}</p>

                              <div className="mt-4 flex gap-3 flex-col items-center justify-center">
                                  {user.ban === 0 ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors duration-300 px-3 py-1">
                                        <UserCheck className="h-3.5 w-3.5 mr-1" /> {t.active}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
                                        <ShieldAlert className="h-3.5 w-3.5 mr-1" /> {t.blocked}
                                    </Badge>
                                  )}
                                  <Badge onClick={scrollToPassword} className="bg-blue-50 text-blue-700 cursor-pointer border-blue-200 hover:bg-emerald-100 transition-colors duration-300 md:hidden px-3 py-1">
                                      <Key  className="h-3.5 w-3.5 mr-1" /> {t.changePassword}
                                  </Badge>
                              </div>
                          </div>
                      </CardHeader>

                      <CardContent>
                          <div className="space-y-3 mt-2">
                              <div className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                  <Hash className="h-4 w-4 text-primary mr-3" />
                                  <div>
                                      <p className="text-sm text-muted-foreground">{t.nis}</p>
                                      <p className="font-medium text-black ">{user.nis}</p>
                                  </div>
                              </div>

                              <div className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                  <Mail className="h-4 w-4 text-primary mr-3" />
                                  <div>
                                      <p className="text-sm text-muted-foreground">{t.username}</p>
                                      <p className="font-medium text-black ">{user.username}</p>
                                  </div>
                              </div>
                              <div className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                                  <Type className="h-4 w-4 text-primary mr-3" />
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
                              <User className="h-5 w-5 text-primary mr-2" />
                              {t.studentInfo}
                          </CardTitle>
                      </CardHeader>

                      <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <InfoPanel
                                title={t.studentData}
                                items={[
                                    {
                                        icon: <User className="h-4 w-4 text-primary" />,
                                        label: t.fullName,
                                        value: user.nama_siswa,
                                    },
                                    {
                                        icon: <Book className="h-4 w-4 text-primary" />,
                                        label: t.class,
                                        value: `Kelas ${user.nama_kelas}`,
                                    },
                                    {
                                        icon: <School className="h-4 w-4 text-primary" />,
                                        label: t.nis,
                                        value: user.nis,
                                    },
                                    {
                                        icon: <School className="h-4 w-4 text-primary" />,
                                        label: t.angkatan,
                                        value: `${user.angkatan}`,
                                    },
                                ]}
                              />

                              <div ref={passwordRef} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                      <Key className="h-5 w-5 text-primary" /> Ubah Password
                                  </h3>
                                  <p className="text-sm text-gray-500 mb-3">Masukkan password baru untuk memperbarui akun Anda.</p>
                                  <Input
                                    placeholder="Masukkan password baru"
                                    type="password"
                                    className="w-full max-md:text-xs mb-5 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none transition"
                                  /><Input
                                    placeholder="Konfirmasi password baru"
                                    type="password"
                                    className="w-full max-md:text-xs px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none transition"
                                  />
                                  <button className="mt-4 w-full max-md:text-xm bg-primary text-white font-medium py-2 rounded-lg hover:bg-indigo-600 transition">
                                      Simpan Password
                                  </button>
                              </div>

                          </div>
                      </CardContent>
                  </Card>

              </div>
          </div>
      </div>
    );
}
