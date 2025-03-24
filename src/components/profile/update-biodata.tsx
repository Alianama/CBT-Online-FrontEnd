import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {useContext, useState} from "react";
import LanguageContext from "@/context/LanguageContext.tsx";
import {Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {SelectGroup} from "@radix-ui/react-select";
import {useMutation} from "@tanstack/react-query";
import {sendOTP, updateProfil} from "@/app/api/api-cbt.ts";
import {useGlobal} from "@/context/GlobalContext.tsx";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "../ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


export default function UpdateBiodata() {
  const {generalUser} = useGlobal()
  const {locale} = useContext(LanguageContext);
  console.log(typeof generalUser?.user_id);
  const translations = {
    id: {
      updateBiodata: "Perbarui Biodata",
      enterBiodata: "Silakan lengkapi biodata Anda.",
      saveBiodata: "Simpan Biodata",
      verifyPhone: "Verifikasi No HP",
      phoneVerified: "Nomor HP berhasil diverifikasi!",
      confirmChange: "Apakah Anda yakin ingin menyimpan perubahan biodata?",
      successUpdate: "Biodata berhasil diperbarui",
      errorOccurred: "Terjadi kesalahan",
    },
    en: {
      updateBiodata: "Update Biodata",
      enterBiodata: "Please complete your biodata.",
      saveBiodata: "Save Biodata",
      verifyPhone: "Verify Phone Number",
      phoneVerified: "Phone number verified successfully!",
      confirmChange: "Are you sure you want to save the biodata changes?",
      successUpdate: "Biodata updated successfully",
      errorOccurred: "An error occurred",
    },
  };

  const t = translations[locale as keyof typeof translations];
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [telponVerif, setTelponVerif] = useState(false);
  const [isOtpSend, setIsOtpSend] = useState(false)


  const [biodata, setBiodata] = useState({
    id: generalUser?.user_id,
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

  const handleVerifyPhone = async (phone: string) => {
    if (!phone) {
      toast.error("Nomor HP tidak boleh kosong");
      return;
    }

    try {
      const response = await sendOTP(phone); // Menunggu hasil dari API
      toast.success("OTP telah dikirim ke nomor HP Anda!");
      return response; // Jika perlu digunakan di tempat lain
    } catch (error) {
      toast.error("Gagal mengirim OTP. Silakan coba lagi.");
      console.error("Error mengirim OTP:", error);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBiodata({...biodata, [e.target.name]: e.target.value});
  };


  const mutation = useMutation({
    mutationKey: ["saveBiodata"],
    mutationFn: updateProfil,
    onSuccess: () => {
      toast.success("Biodata berhasil diperbarui!");
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan saat menyimpan biodata");
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value.replace(/\D/g, "");
    setBiodata({...biodata, no_hp: newPhone});
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Badge
            onClick={() => setDialogOpen(true)}
            className="bg-blue-50 text-green-600 cursor-pointer border-blue-200 hover:bg-emerald-100 transition-colors duration-300 px-3 py-1"
          >
            {t.updateBiodata}
          </Badge>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.updateBiodata}</DialogTitle>
            <DialogDescription>{t.enterBiodata}</DialogDescription>
          </DialogHeader>

          {/* Form Biodata */}
          <div className="space-y-3">
            <Input required name="motto" value={biodata.motto} onChange={handleChange} placeholder="Motto Hidup"/>
            <Input required name="tempat_lahir" value={biodata.tempat_lahir} onChange={handleChange}
                   placeholder="Tempat Lahir"/>
            <Input required name="tanggal_lahir" value={biodata.tanggal_lahir} onChange={handleChange}
                   placeholder="Tanggal Lahir" type="date"/>

            {/* Select untuk Jenis Kelamin */}
            <Select
              required
              value={biodata.jenis_kelamin}
              onValueChange={(value) => setBiodata({...biodata, jenis_kelamin: value})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Jenis Kelamin"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Jenis Kelamin</SelectLabel>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input required name="provinsi" value={biodata.provinsi} onChange={handleChange} placeholder="Provinsi"/>
            <Input required name="kota" value={biodata.kota} onChange={handleChange} placeholder="Kota"/>
            <Input required name="kecamatan" value={biodata.kecamatan} onChange={handleChange} placeholder="Kecamatan"/>
            <Input required name="kelurahan" value={biodata.kelurahan} onChange={handleChange} placeholder="Kelurahan"/>
            <Input required name="alamat" value={biodata.alamat} onChange={handleChange} placeholder="Alamat"/>

            {/* Input dan Tombol Verifikasi Nomor HP */}
            <div className="flex gap-2">
              <Input
                required
                name="no_hp"
                value={biodata.no_hp}
                onChange={handlePhoneChange}
                placeholder="Nomor HP"
                type="text"
                className="flex-1"
              />
              <Button
                onClick={async () => {
                  try {
                    await handleVerifyPhone(biodata.no_hp);
                    setIsOtpSend(true)
                    setDialogOpen(false);
                  } catch (error) {
                    console.error("Verification failed:", error);
                  }
                }}
                disabled={loading || telponVerif}
                className="bg-primary hover:bg-green-700 text-white"
              >
                {telponVerif ? "✅ Verified" : t.verifyPhone}
              </Button>

            </div>

            <Input required name="hobi" value={biodata.hobi} onChange={handleChange} placeholder="Hobi"/>
            <Input required name="cita" value={biodata.cita} onChange={handleChange} placeholder="Cita-cita"/>
          </div>

          <DialogFooter className="flex justify-end mt-4">
            <Button
              onClick={() => setConfirmDialogOpen(true)}
              className="bg-primary hover:bg-primary/70 text-white"
              disabled={!telponVerif}
            >
              {loading ? "Loading..." : t.saveBiodata}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Simpan */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.confirmChange}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3">
            <Button className="bg-gray-400 hover:bg-gray-500" onClick={() => setConfirmDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-primary hover:bg-primary/70 text-white" onClick={() => mutation.mutate(biodata)}
                    disabled={loading}>
              {loading ? "Loading..." : t.saveBiodata}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isOtpSend}
        onOpenChange={(open) => {
          setIsOtpSend(open);
          setDialogOpen(open);
        }}
      >

      <DialogTitle>
          Verify OTP
        </DialogTitle>
        <DialogContent>

          <DialogHeader>
            {t.verifyPhone}
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                // control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your phone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>

        </DialogContent>

      </Dialog>
    </>
  );
}
