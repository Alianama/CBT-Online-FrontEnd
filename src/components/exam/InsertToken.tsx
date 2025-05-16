import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { CheckCircle2, KeyRound, Loader2, ShieldAlert } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useGlobal } from "@/context/GlobalContext.tsx"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { postTokenUjian } from "@/app/api/api-cbt"
import OTPInputFields from "@/components/exam/TokenInputFields.tsx";

const FormSchema = z.object({
  token: z.string().min(5, "Token harus 5 digit").max(5, "Token harus 5 digit")
})

interface InsertTokenProps {
  id_peserta?: number
  isInsertToken: boolean
  setIsInsertToken: (open: boolean) => void
}

export default function InsertToken({
                                      id_peserta,
                                      isInsertToken,
                                      setIsInsertToken
                                    }: InsertTokenProps) {
  const navigate = useNavigate()
  const { setWsToken } = useGlobal()
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      token: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)
    setHasError(false)
    setErrorMessage("")

    try {
      const response = await postTokenUjian(data.token, id_peserta)
      const websocket = response.data

      if (response.status === "success") {
        setWsToken(websocket.token)
        toast.success("Token berhasil diverifikasi!")
        navigate(`/exam/start`, { replace: true })
        setIsInsertToken(false)
        form.reset()
      }
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : "Terjadi kesalahan yang tidak diketahui."
      toast.error(message)
      setHasError(true)
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
      <Dialog open={isInsertToken} onOpenChange={setIsInsertToken}>
        <DialogContent className="sm:max-w-md overflow-hidden border-0 shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-cyan-800" />
          <div className="flex flex-col items-center pt-6">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
              <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold">Masukkan Token Ujian</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Silakan masukkan token yang telah diberikan untuk memulai ujian
              </p>
            </DialogHeader>
          </div>

          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 flex flex-col items-center">
                <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                          <FormLabel>Token Ujian</FormLabel>
                          <FormControl>
                            <OTPInputFields
                                value={field.value}
                                onChange={field.onChange}
                                length={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {loading ? (
                      <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memverifikasi...
                  </span>
                  ) : (
                      <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Submit
                  </span>
                  )}
                </Button>
              </form>
            </Form>

            {hasError && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
                variant="outline"
                onClick={() => {
                  setIsInsertToken(false)
                  form.reset()
                  setHasError(false)
                  setErrorMessage("")
                }}
                disabled={loading}
                className="w-full sm:w-auto"
            >
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
