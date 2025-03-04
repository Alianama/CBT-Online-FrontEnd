import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="justify-center items-center h-screen flex-col gap-5 flex bg-red-50 animate-fade-in">
            <h1 className="text-4xl max-md:text-lg font-bold text-red-600">404</h1>
            <h1 className="text-2xl max-md:text-lg font-bold text-red-600">Oopss!! Page Not Found!!</h1>
            <Button
                onClick={() => navigate("/")}
                className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200">
                Back to Home
            </Button>
        </div>
    );
}
