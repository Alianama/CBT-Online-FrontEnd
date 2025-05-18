import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import React, {useContext, useEffect, useState} from "react";
import LanguageContext from "@/context/LanguageContext.tsx";
import {Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {SelectGroup} from "@radix-ui/react-select";
import {
    sendOTP,
    addProfil,
    updateProfil,
    verifyOTP,
    getProvinces,
    getKabKota,
    getKecamatan, getKelurahan
} from "@/app/api/api-cbt.ts";
import {useGlobal} from "@/context/GlobalContext.tsx";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "../ui/input-otp";
import {useNavigate} from "react-router-dom";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import Layout from "@/components/sidebar/Layout.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useQuery} from "@tanstack/react-query";
import {Profil} from "@/types/types.ts";

interface Province {
    name: string;
    id: string
}

export default function UpdateProfile() {
    const translations = {
        id: {
            updatebiodataNew: "Perbarui biodata",
            enterbiodataNew: "Silakan lengkapi biodata Anda.",
            savebiodataNew: "Simpan biodata",
            verifyPhone: "Verifikasi No HP",
            phoneVerified: "Nomor HP berhasil diverifikasi!",
            confirmChange: "Apakah Anda yakin ingin menyimpan perubahan biodata?",
            successUpdate: "biodataNew berhasil diperbarui",
            errorOccurred: "Terjadi kesalahan",
            cancel: "Batal",
            beforeSave: "Verifikasi No Telpon terlebih dahulu sebelum simpan biodata!!"
        },
        en: {
            updatebiodataNew: "Update biodata",
            enterbiodataNew: "Please complete your biodata.",
            savebiodataNew: "Save biodata",
            verifyPhone: "Verify Phone Number",
            phoneVerified: "Phone number verified successfully!",
            confirmChange: "Are you sure you want to save the biodata changes?",
            successUpdate: "biodata updated successfully",
            errorOccurred: "An error occurred",
            cancel: "Cancel",
            beforeSave: "Plaese Verify your phone number before save biodata!!"
        },
    };
    const [kota, setKota] = useState<{ id: string; name: string }[]>([]);
    const [kecamatan, setKecamatan] = useState<{ id: string; name: string; regency_id: string }[]>([]);
    const [kelurahan, setKelurahan] = useState<{ id: string; name: string; district_id: string }[]>([]);
    const {generalUser, biodata, setBiodata, refreshUser} = useGlobal();
    const user_id = generalUser?.user_id
    const user_type = String(generalUser?.user_type);
    const {locale} = useContext(LanguageContext);
    const t = translations[locale as keyof typeof translations];
    const [verifyOTPMessage, setVerifyOTPMessage] = useState<string | null>(null);
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [telponVerif, setTelponVerif] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isOtpSend, setIsOtpSend] = useState(false)
    const [biodataNew, setbiodataNew] = useState({
        user_id,
        user_type,
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        provinsi: "",
        kota: "",
        kecamatan: "",
        kelurahan: "",
        alamat: "",
        no_hp: "",
        hobi: "",
        cita: "",
        motto: "",
    });
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            await refreshUser()
            setbiodataNew({
                user_id: biodata?.user_id,
                user_type: biodata?.user_type || "",
                tempat_lahir: biodata?.tempat_lahir || "",
                tanggal_lahir: biodata?.tanggal_lahir || "",
                jenis_kelamin: biodata?.jenis_kelamin || "",
                provinsi: biodata?.provinsi || "",
                kota: biodata?.kota || "",
                kecamatan: biodata?.kecamatan || "",
                kelurahan: biodata?.kelurahan || "",
                alamat: biodata?.alamat || "",
                no_hp: biodata?.no_hp || "",
                hobi: biodata?.hobi || "",
                cita: biodata?.cita || "",
                motto: biodata?.motto || "",
            });
            if (biodata?.no_hp) {
                setTelponVerif(true);
            }
        })()
    }, [refreshUser]);
    const handleVerifyPhone = async (phone: string) => {
        if (!phone) {
            toast.error("Nomor HP tidak boleh kosong");
            return;
        }
        try {
            const response = await sendOTP(phone);
            if (response.status === "success") {
                toast.success("OTP telah dikirim ke nomor HP Anda!");
                setIsOtpSend(true);
                setDisableButton(true);
                let timeLeft = 120;
                setCountdown(timeLeft);
                const interval = setInterval(() => {
                    timeLeft -= 1;
                    setCountdown(timeLeft);
                    if (timeLeft <= 0) {
                        clearInterval(interval);
                        setDisableButton(false);
                    }
                }, 1000);
            }
            return response;
        } catch (error) {
            toast.error("Gagal mengirim OTP. Silakan coba lagi.");
            console.error("Error mengirim OTP:", error);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setbiodataNew({...biodataNew, [e.target.name]: e.target.value});
    };
    const handleSubmitProfile = async () => {
        setLoading(true);
        try {
            let response;
            if (!biodata?.id_biodata) {
                response = await addProfil({
                    user_id,
                    user_type,
                    tempat_lahir: biodataNew.tempat_lahir,
                    tanggal_lahir: biodataNew.tanggal_lahir,
                    jenis_kelamin: biodataNew.jenis_kelamin,
                    provinsi: biodataNew.provinsi,
                    kota: biodataNew.kota,
                    kecamatan: biodataNew.kecamatan,
                    kelurahan: biodataNew.kelurahan,
                    alamat: biodataNew.alamat,
                    no_hp: biodataNew.no_hp,
                    hobi: biodataNew.hobi,
                    cita: biodataNew.cita,
                    motto: biodataNew.motto,
                });
            } else {
                response = await updateProfil({
                    id_biodata: biodata.id_biodata,
                    tempat_lahir: biodataNew.tempat_lahir,
                    tanggal_lahir: biodataNew.tanggal_lahir,
                    jenis_kelamin: biodataNew.jenis_kelamin,
                    provinsi: biodataNew.provinsi,
                    kota: biodataNew.kota,
                    kecamatan: biodataNew.kecamatan,
                    kelurahan: biodataNew.kelurahan,
                    alamat: biodataNew.alamat,
                    no_hp: biodataNew.no_hp,
                    hobi: biodataNew.hobi,
                    cita: biodataNew.cita,
                    motto: biodataNew.motto,
                });
            }
            toast.success(response.message);
            setBiodata((prev: Profil | null) => ({
                ...((prev as Profil | null)),
                ...biodataNew,
                id_biodata: prev?.id_biodata || response?.id_biodata,
            }));
            setConfirmDialogOpen(false);
            navigate("/profile");
            return response;
        } catch (error) {
            console.error("Gagal memperbarui profil:", error);
            toast.error("Terjadi kesalahan, coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhone = e.target.value.replace(/\D/g, "");
        setbiodataNew({...biodataNew, no_hp: newPhone});
        setTelponVerif(false)
    };
    const FormSchema = z.object({
        otp: z.string().min(6, {
            message: "Your one-time password must be 6 characters.",
        }),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
        },
    })
    const safeLocale = locale === "id" || locale === "en" ? locale : "en";
    const pageData: Record<"id" | "en", { name: string; url: string }[]> = {
        id: [
            {name: "Profil", url: "/profile"},
            {name: "Update Profil", url: "#"},
        ],
        en: [
            {name: "Profile", url: "/profile"},
            {name: "Profile Update", url: "#"},
        ],
    };
    const onOTPSubmit = async (data: z.infer<typeof FormSchema>) => {
        const otp = data.otp;
        setLoading(true)
        try {
            const response = await verifyOTP(biodataNew.no_hp, otp);
            console.log(response)
            if (response.status === "success") {
                console.log(response);
                setTelponVerif(true)
                setIsOtpSend(false);
                setConfirmDialogOpen(false);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setVerifyOTPMessage(error.message);
            } else {
                setVerifyOTPMessage("Terjadi kesalahan yang tidak diketahui");
            }
            console.log(error);
            toast.error(verifyOTPMessage);
            setIsOtpSend(false);
        } finally {
            setLoading(false)
        }
    }
    const {data: provinces} = useQuery({
        queryKey: ["province"],
        queryFn: getProvinces,
    });
    const handleSelectKota = async (id: string | undefined) => {
        try {
            const kota = await getKabKota(id)
            setKota(kota)
        } catch (error) {
            console.error(error);
        }
    }
    const handleSelectKecamatan = async (id: string | undefined) => {
        try {
            const kecamatan = await getKecamatan(id)
            setKecamatan(kecamatan)
        } catch (error) {
            console.error(error);
        }
    }
    const handleSelectKelurahan = async (id: string | undefined) => {
        try {
            const kelurahan = await getKelurahan(id)
            setKelurahan(kelurahan)
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Layout data={pageData[safeLocale]}>
            <div className="container gap-10 mx-auto py-6 px-4 md:px-6 flex flex-col">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Update Profile
                    </h1>
                </div>
                <div className="flex max-md:flex-col gap-10">
                    <div className="flex gap-4 flex-col max-md:w-full w-1/3">
                        <p className="text-xl max-md:text-sm">Informasi Pribadi</p>

                        <div className="flex flex-col gap-2">
                            <Label>Nama</Label>
                            <div
                                className="border border-input bg-background rounded-md px-3 py-2 text-sm text-muted-foreground">
                                {generalUser?.nama || "Tidak tersedia"}
                            </div>
                        </div>


                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                            <Input required id="tempat_lahir" name="tempat_lahir" value={biodataNew.tempat_lahir}
                                   onChange={handleChange} placeholder="Tempat Lahir"/>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                            <Input required id="tanggal_lahir" name="tanggal_lahir" type="date"
                                   value={biodataNew.tanggal_lahir}
                                   onChange={handleChange} placeholder="Tanggal Lahir"/>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Jenis Kelamin</Label>
                            <Select
                                required
                                value={biodataNew.jenis_kelamin}
                                onValueChange={(value) => setbiodataNew({...biodataNew, jenis_kelamin: value})}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Jenis Kelamin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Jenis Kelamin</SelectLabel>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="hobi">Hobi</Label>
                            <Input required id="hobi" name="hobi" value={biodataNew.hobi} onChange={handleChange}
                                   placeholder="Hobi"/>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="cita">Cita-cita</Label>
                            <Input required id="cita" name="cita" value={biodataNew.cita} onChange={handleChange}
                                   placeholder="Cita-cita"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="motto">Moto Hidup</Label>
                            <Input type="textarea" required id="motto" name="motto" value={biodataNew.motto}
                                   onChange={handleChange}
                                   placeholder="Moto Hidup"/>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col max-md:w-full w-1/3">
                        <p className="text-xl max-md:text-sm">Informasi Domisili</p>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="provinsi">Provinsi</Label>
                            <Select
                                required
                                value={biodataNew.provinsi}
                                onValueChange={async (value) => {
                                    const selectedProvince = provinces.find((province: Province) => province.name === value);
                                    setbiodataNew({...biodataNew, provinsi: value})
                                    await handleSelectKota(selectedProvince.id)
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Provinsi">{biodataNew.provinsi}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Provinsi</SelectLabel>
                                        {provinces?.map((province: { id: string; name: string }) => (
                                            <SelectItem onSelect={() => handleSelectKota(province.id)} key={province.id}
                                                        value={province.name}>
                                                {province.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="kota">Kota</Label>
                            <Select
                                required
                                value={biodataNew.kota}
                                onValueChange={async (value) => {
                                    const selectedKota = kota.find((kotas: {
                                        id: string | undefined;
                                        name: string | undefined;
                                    }) => kotas.name === value);
                                    setbiodataNew({...biodataNew, kota: value})
                                    await handleSelectKecamatan(selectedKota?.id)
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kota">{biodataNew.kota}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Kota</SelectLabel>
                                        {kota?.map((kotas: { id: string; name: string }) => (
                                            <SelectItem key={kotas.id} value={kotas.name}>
                                                {kotas.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="kecamatan">Kecamatan</Label>
                            <Select
                                required
                                value={biodataNew.kecamatan}
                                onValueChange={async (value) => {
                                    const selectedKecamatan = kecamatan.find((kec: {
                                        id: string | undefined;
                                        name: string | undefined;
                                        regency_id: string | undefined;
                                    }) => kec.name === value);
                                    setbiodataNew({...biodataNew, kecamatan: value})
                                    await handleSelectKelurahan(selectedKecamatan?.id)
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kecamatan">{biodataNew.kecamatan}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Kecamatan</SelectLabel>
                                        {kecamatan?.map((kec: { id: string; name: string }) => (
                                            <SelectItem key={kec.id} value={kec.name}>
                                                {kec.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="kelurahan">Kelurahan</Label>
                            <Select
                                required
                                value={biodataNew.kelurahan}
                                onValueChange={(value) => {
                                    setbiodataNew({...biodataNew, kelurahan: value})
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kelurahan">{biodataNew.kelurahan}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Keluarahan</SelectLabel>
                                        {kelurahan?.map((kel: { id: string; name: string }) => (
                                            <SelectItem key={kel.id} value={kel.name}>
                                                {kel.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input required id="alamat" name="alamat" value={biodataNew.alamat} onChange={handleChange}
                                   placeholder="Alamat"/>
                        </div>
                    </div>

                    <div className="flex w-1/3 max-md:w-full flex-col gap-10">
                        <p className="text-xl max-md:text-sm">Kontak</p>
                        <div className="flex max-md:flex-col gap-5 ">
                            <Input
                                required
                                name="no_hp"
                                value={biodataNew.no_hp}
                                onChange={handlePhoneChange}
                                placeholder="Nomor HP"
                                type="text"
                            />
                            <Button
                                onClick={() => handleVerifyPhone(biodataNew.no_hp)}
                                disabled={loading || telponVerif || disableButton}
                                className="bg-primary hover:bg-green-700 text-white"
                            >
                                {telponVerif ? "✅ Verified" : disableButton ? `Tunggu ${countdown}s` : t.verifyPhone}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center gap-5 text-red-900/90  w-full">
                    <p className="text-xs">{t.beforeSave}</p>
                    <Button
                        onClick={() => setConfirmDialogOpen(true)}
                        className="bg-primary w-full hover:bg-primary/70 text-white"
                        disabled={!telponVerif}
                    >
                        {loading ? "Loading..." : t.savebiodataNew}
                    </Button>
                </div>

                <Dialog open={isConfirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t.confirmChange}</DialogTitle>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-3">
                            <Button className="bg-gray-400 hover:bg-gray-500"
                                    onClick={() => setConfirmDialogOpen(false)}>
                                {t.cancel}
                            </Button>
                            <Button className="bg-primary hover:bg-primary/70 text-white"
                                    onClick={() => handleSubmitProfile()}
                                    disabled={loading}>
                                {loading ? "Loading..." : t.savebiodataNew}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={isOtpSend}
                    onOpenChange={(open) => {
                        setIsOtpSend(open);
                    }}
                >
                    <DialogContent className=""
                                   onInteractOutside={(e) => {
                                       e.preventDefault();
                                   }}>

                        <DialogHeader>
                            {t.verifyPhone}
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onOTPSubmit)} className="w-2/3 space-y-6">
                                <FormField
                                    name="otp"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>One-Time Password</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0}/>
                                                        <InputOTPSlot index={1}/>
                                                        <InputOTPSlot index={2}/>
                                                        <InputOTPSlot index={3}/>
                                                        <InputOTPSlot index={4}/>
                                                        <InputOTPSlot index={5}/>
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription onChange={() => setVerifyOTPMessage(null)}
                                                             className={verifyOTPMessage ? "text-red-500" : ""}>
                                                {verifyOTPMessage || "Please enter the one-time password sent to your phone."}
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit">Verify</Button>
                            </form>
                        </Form>

                    </DialogContent>

                </Dialog>
            </div>
        </Layout>
    );
}