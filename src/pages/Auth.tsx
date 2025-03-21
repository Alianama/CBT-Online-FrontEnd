import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userAuth } from "@/app/api/api-cbt.ts";
import { toast } from "sonner";
import {
  setAccessToken,
  setRefreshToken,
  setUserData,
  setSchoolName,
} from "@/utils/storage.ts";
import LoginLoadingAnimation from "@/components/ui/login-loading.tsx";
import { isAuthenticated } from "@/utils/auth.ts";
import { useGlobal } from "@/context/GlobalContext.tsx";

const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;
export default function Auth() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { refreshUser } = useGlobal();
  useEffect(() => {
    (async () => {
      if (await isAuthenticated()) {
        navigate("/");
        return;
      }
      if (token) {
        try {
          setLoading(true);
          const response = await userAuth(token);
          if (response) {
            const { access_token, refresh_token, user_data, nama_sekolah } =
              response;
            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            setUserData(user_data);
            setSchoolName(nama_sekolah);
            console.log("✅ User authenticated:", response);
            setMessage("Authentication successful! 🎉");
            toast.success("Login success!");
            await refreshUser();
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            console.warn("⚠️ Authentication failed:", response);
            setMessage("Authentication failed! Invalid response.");
            toast.error("Login failed. Invalid response.");
            setTimeout(() => {
              window.location.href = LOGOUT_URL;
            }, 3000);
          }
        } catch (error) {
          console.error("❌ Authentication error:", error);
          setMessage(`Authentication failed! ${error ?? "Unknown error"}`);
          toast.error("Login failed.");
          setTimeout(() => {
            window.location.href = LOGOUT_URL;
          }, 3000);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [token, navigate, refreshUser]);
  return (
    <div>
      <LoginLoadingAnimation isLoading={loading} text={message} />
    </div>
  );
}
