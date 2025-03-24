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
import {sendOTP, addProfil, updateProfil, verifyOTP} from "@/app/api/api-cbt.ts";
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
    const {generalUser, biodata} = useGlobal()
    const user_id = generalUser?.user_id
    const user_type = String(generalUser?.user_type)
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
        if (biodata) {
            setbiodataNew((prev) => ({
                ...prev,
                user_id: biodata?.user_id || prev.user_id,
                user_type: biodata?.user_type || prev.user_type,
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
            }));
        }
    }, [biodata]);
    const handleVerifyPhone = async (phone: string) => {
        if (!phone) {
            toast.error("Nomor HP tidak boleh kosong");
            return;
        }
        try {
            const response = await sendOTP(phone);
            if (response && response.status === true) {
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
        if (!biodata?.id_biodata) {
            try {
                const response = await addProfil({
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
                console.log("Profil berhasil diperbarui!", response)
                setConfirmDialogOpen(false);
                toast.success("Profil berhasil diperbarui!");
                navigate("/profile");
                return response;
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const response = await updateProfil({
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
                console.log(response)
                setConfirmDialogOpen(false);
                toast.success("Profil berhasil diperbarui!");
                navigate("/profile");
                return response;
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
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
            {name: "Materi", url: "/lesson"},
            {name: "Buku Materi", url: "#"},
        ],
        en: [
            {name: "Lesson", url: "/lesson"},
            {name: "Lesson Book", url: "#"},
        ],
    };
    const onOTPSubmit = async (data: z.infer<typeof FormSchema>) => {
        const otp = data.otp;
        setLoading(true)
        try {
            const response = await verifyOTP(biodataNew.no_hp, otp);
            console.log(otp)
            if (response.status === true) {
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
        } finally {
            setLoading(false)
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
                <div className="space-y-3">
                    <Input required name="motto" value={biodataNew.motto} onChange={handleChange}
                           placeholder="Motto Hidup"/>
                    <Input required name="tempat_lahir" value={biodataNew.tempat_lahir} onChange={handleChange}
                           placeholder="Tempat Lahir"/>
                    <Input required name="tanggal_lahir" value={biodataNew.tanggal_lahir} onChange={handleChange}
                           placeholder="Tanggal Lahir" type="date"/>

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
                                <SelectLabel>Jenis Kelamin</SelectLabel>
                                <SelectItem value="L">Laki-laki</SelectItem>
                                <SelectItem value="P">Perempuan</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Input required name="provinsi" value={biodataNew.provinsi} onChange={handleChange}
                           placeholder="Provinsi"/>
                    <Input required name="kota" value={biodataNew.kota} onChange={handleChange} placeholder="Kota"/>
                    <Input required name="kecamatan" value={biodataNew.kecamatan} onChange={handleChange}
                           placeholder="Kecamatan"/>
                    <Input required name="kelurahan" value={biodataNew.kelurahan} onChange={handleChange}
                           placeholder="Kelurahan"/>
                    <Input required name="alamat" value={biodataNew.alamat} onChange={handleChange}
                           placeholder="Alamat"/>


                    <div className="flex gap-2">
                        <Input
                            required
                            name="no_hp"
                            value={biodataNew.no_hp}
                            onChange={handlePhoneChange}
                            placeholder="Nomor HP"
                            type="text"
                            className="flex-1"
                            disabled={telponVerif}
                        />
                        <Button
                            onClick={() => handleVerifyPhone(biodataNew.no_hp)}
                            disabled={loading || telponVerif || disableButton}
                            className="bg-primary hover:bg-green-700 text-white"
                        >
                            {telponVerif ? "✅ Verified" : disableButton ? `Tunggu ${countdown}s` : t.verifyPhone}
                        </Button>

                    </div>

                    <Input required name="hobi" value={biodataNew.hobi} onChange={handleChange} placeholder="Hobi"/>
                    <Input required name="cita" value={biodataNew.cita} onChange={handleChange}
                           placeholder="Cita-cita"/>
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


