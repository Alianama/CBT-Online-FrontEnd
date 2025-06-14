import { Route, Routes, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import LanguageContext from "@/context/LanguageContext.tsx";
import useSecurity from "@/hooks/useSecurity";
import Focus from "@/pages/Fokus";
import Exam from "@/pages/Exam.tsx";
import Agenda from "@/pages/Agenda.tsx";
import NotFound from "@/pages/NotFound.tsx";
import Auth from "@/pages/Auth.tsx";
import PrivateRoute from "@/components/privateRoute/PrivateRoute.tsx";
import Home from "@/pages/Home.tsx";
import Profile from "@/pages/Profile.tsx";
import Logout from "@/pages/Logout.tsx";
import useTokenRefresh from "@/hooks/useTokenRefresh.tsx";
import Lesson from "@/pages/Lesson.tsx";
import SubjectPage from "@/components/lesson/SubjectPage";
import DocumentOpen from "@/components/lesson/viewer/document-open.tsx";
import UpdateProfile from "@/components/profile/UpdateProfile.tsx";
import QuestionPage from "@/pages/Question.tsx";
import Result from "./pages/Result";
import HistoryJawaban from "./pages/HistoryJawaban";
import ExamActivityCheck from "@/components/ExamActivityCheck";

export default function App() {
  const [locale, setLanguage] = useState<string>(
    localStorage.getItem("locale") || "id"
  );
  const { disableRightClick, disableShortcut, isSecurityEnabled, showToast } =
    useSecurity();
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
          navigate("/focus");
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
    return { locale, toggleLocale };
  }, [locale]);
  useTokenRefresh();
  return (
    <LanguageContext.Provider value={contextValue}>
      <ExamActivityCheck />
      <Toaster position="top-right" richColors />
      <Routes>
        {[
          { path: "/", element: <Home /> },
          { path: "/focus", element: <Focus /> },
          { path: "/exam", element: <Exam /> },
          { path: "/agenda", element: <Agenda /> },
          { path: "/lesson", element: <Lesson /> },
          { path: "/profile", element: <Profile /> },
          { path: "/update-profile", element: <UpdateProfile /> },
          { path: "/logout", element: <Logout /> },
          {
            path: "/lesson/:subject/:idKelas/:idMapel",
            element: <SubjectPage />,
          },
          {
            path: "/lesson/:index/:subject/:idKelas/:idMapel/materi/:tipe_materi/:attachment/:title",
            element: <DocumentOpen />,
          },
          {
            path: "/exam/start",
            element: <QuestionPage />,
          },
          {
            path: "/result",
            element: <Result />,
          },
          {
            path: "/result/answer/:id",
            element: <HistoryJawaban />,
          },
        ].map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoute>{element}</PrivateRoute>}
          />
        ))}

        <Route path="/auth/:token" element={<Auth />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </LanguageContext.Provider>
  );
}
