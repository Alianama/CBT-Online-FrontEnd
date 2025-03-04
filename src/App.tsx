import {Route, Routes, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Toaster} from "sonner";
import Home from "@/pages/Home.tsx";
import Materi from "@/pages/Materi.tsx";
import Login from "@/pages/Login.tsx";
import LangContext from "@/context/LangContext.tsx";
import useAuth from "@/hooks/useAuth";
import useSecurity from "@/hooks/useSecurity";
import Fokus from "@/pages/Fokus";
import Exam from "@/pages/Exam.tsx";
import Schedule from "@/pages/Schedule.tsx";
import NotFound from "@/pages/NotFound.tsx";

export default function App() {
    const [locale, setLanguage] = useState<string>(localStorage.getItem("locale") || "id");
    const {userAuth, onLoginSuccess} = useAuth();
    const {disableRightClick, disableShortcut, isSecurityEnabled, showToast} = useSecurity();
    const navigate = useNavigate();
    const detectDevTools = useCallback(() => {
        if (!isSecurityEnabled) return;
        const threshold = 160;
        const checkDevTools = () => {
            if (
                window.outerWidth - window.innerWidth > threshold ||
                window.outerHeight - window.innerHeight > threshold
            ) {
                showToast("Mode pengembang terdeteksi! Mengalihkan halaman...");
                setTimeout(() => {
                    navigate("/fokus");
                }, 10000);
            }
        };
        window.addEventListener("resize", checkDevTools);
        checkDevTools();
        return () => window.removeEventListener("resize", checkDevTools);
    }, [navigate, isSecurityEnabled, showToast]);
    useEffect(() => {
        detectDevTools();
    }, [detectDevTools]);
    useEffect(() => {
        if (isSecurityEnabled) {
            document.addEventListener("contextmenu", disableRightClick);
            document.addEventListener("keydown", disableShortcut);
        } else {
            document.removeEventListener("contextmenu", disableRightClick);
            document.removeEventListener("keydown", disableShortcut);
        }
        return () => {
            document.removeEventListener("contextmenu", disableRightClick);
            document.removeEventListener("keydown", disableShortcut);
        };
    }, [disableRightClick, disableShortcut, isSecurityEnabled]);
    const toggleLocale = () => {
        setLanguage((prevLocale) => {
            const newLocale = prevLocale === "id" ? "en" : "id";
            localStorage.setItem("locale", newLocale);
            return newLocale;
        });
    };
    const contextValue = useMemo(() => {
        return {locale, toggleLocale};
    }, [locale]);
    if (!userAuth) {
        return <Login onSuccess={onLoginSuccess}/>;
    }
    return (
        <LangContext.Provider value={contextValue}>
            <Toaster position="top-right" richColors/>
            <Routes>
                <Route path="/login" element={<Login onSuccess={onLoginSuccess}/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/materi" element={<Materi/>}/>
                <Route path="/fokus" element={<Fokus/>}/>
                <Route path="/exam" element={<Exam/>}/>
                <Route path="/schedule" element={<Schedule/>}/>
                <Route path="/*" element={<NotFound/>}/>

            </Routes>
        </LangContext.Provider>
    );
}
