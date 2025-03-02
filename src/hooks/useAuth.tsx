import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const [userAuth, setUserAuth] = useState<boolean>(
    localStorage.getItem("userAuth") === "true"
  );
  const navigate = useNavigate();

  const onLoginSuccess = useCallback((auth: boolean) => {
    localStorage.setItem("userAuth", JSON.stringify(auth));
    setUserAuth(auth);
  }, []);

  const onLogoutSuccess = useCallback(() => {
    localStorage.removeItem("userAuth");
    setUserAuth(false);
    navigate("/login");
  }, [navigate]);

  return { userAuth, onLoginSuccess, onLogoutSuccess };
}
