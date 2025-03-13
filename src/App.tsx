import {Route, Routes, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Toaster} from "sonner";
import LangContext from "@/context/LangContext.tsx";
import useSecurity from "@/hooks/useSecurity";
import Fokus from "@/pages/Fokus";
import Exam from "@/pages/Exam.tsx";
import Agenda from "@/pages/Agenda.tsx";
import NotFound from "@/pages/NotFound.tsx";
import Lesson from "@/pages/Lesson.tsx";
import Auth from "@/pages/Auth.tsx";
import PrivateRoute from "@/components/privateRoute/PrivateRoute.tsx";
import Home from "@/pages/Home.tsx"
import Profile from "@/pages/Profile.tsx";
import Logout from "@/pages/Logout.tsx";

export default function App() {
    const [locale, setLanguage] = useState<string>(localStorage.getItem("locale") || "id");
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
    // useTokenRefresh();
    return (
        <LangContext.Provider value={contextValue}>
            <Toaster position="top-right" richColors/>
            <Routes>
                {[
                    {path: "/", element: <Home/>},
                    {path: "/fokus", element: <Fokus/>},
                    {path: "/exam", element: <Exam/>},
                    {path: "/Agenda", element: <Agenda/>},
                    {path: "/lesson", element: <Lesson/>},
                    {path: "/profile", element: <Profile/>},
                    {path: "/logout", element: <Logout/>},
                ].map(({path, element}) => (
                    <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>}/>
                ))}

                <Route path="/auth/:token" element={<Auth/>}/>
                <Route path="/*" element={<NotFound/>}/>
            </Routes>
        </LangContext.Provider>
    );
}
