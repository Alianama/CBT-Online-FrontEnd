import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";

export default function Focus() {
  const navigate = useNavigate();
  const detectDevToolsClose = useCallback(() => {
    const threshold = 160;
    const handleResize = () => {
      const isDevToolsOpen =
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold;
      if (!isDevToolsOpen) {
        setTimeout(() => {
          navigate("/");
        }, 10000);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);
  useEffect(() => {
    detectDevToolsClose();
  }, [detectDevToolsClose]);
  return (
    <div className="justify-center items-center h-screen flex-col gap-5 flex bg-red-50 animate-fade-in">
      <h1 className="text-3xl max-md:text-lg font-bold text-red-600">
        Oops!! Jangan Mencontek!!
      </h1>
      <Button
        onClick={() => navigate("/")}
        className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
      >
        Back to Home
      </Button>
    </div>
  );
}
