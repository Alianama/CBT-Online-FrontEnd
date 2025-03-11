import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import logo from "../assets/Image/Logo.png";
import {useNavigate, useParams} from "react-router-dom";
import {toast, Toaster} from "sonner";
import {loginUser} from "@/app/api/api.ts";
import {ModeToggle} from "@/components/Theme/mode-toggle.tsx";

interface LoginProps {
    onSuccess: (e: boolean) => void;
}

export default function Login({onSuccess}: LoginProps) {
    const {token} = useParams<string>();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigate = useNavigate();
    const [IsLoading, setIsLoading] = useState<boolean>(true);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (username.trim() === "" || password.trim() === "") {
            toast.error("Username dan password tidak boleh kosong!");
        }
        setIsLoading(true);
        try {
            const loginSucces = await loginUser(username, password);
            if (loginSucces) {
                toast.success("Login succes!");
                localStorage.setItem("userAuth", JSON.stringify(loginSucces));
                onSuccess(loginSucces);
                navigate("/");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Login Error!");
        } finally {
            setIsLoading(false);
        }
    }
    console.log(token)
    return (
        <div className="flex w-full h-screen p-10 justify-center items-center gap-4 max-md:flex-col max-md:p-2">
            <Toaster position="top-right" richColors/>
            <div className="w-1/2 flex flex-col items-center gap-10 max-md:w-full">
                <h1 className="text-2xl font-bold max-md:text-lg">SMA N 8 TAMBUN SELATAN</h1>
                <img src={logo} alt="logo" className="w-1/2"/>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-1/2 p-10 flex flex-col items-center gap-5 rounded-xl max-md:w-full"
            >
                <ModeToggle/>
                <h1 className="text-2xl font-bold max-md:text-lg">Welcome Back</h1>
                <h2 className="max-md:text-sm">CBT Online SMA N 8 Tambun Selatan</h2>

                <Input
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-4 w-3/4 bg-secondary max-md:w-full"
                    autoFocus
                />
                <Input
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-4 w-3/4 bg-secondary max-md:w-full"
                />
                <label className="flex items-center gap-2">
                    <Input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5"
                    />
                    Remember me?
                </label>
                <h1>{token}</h1>

                <Button type="submit" className="w-3/4 bg-primary max-md:w-full">
                    {IsLoading ? "Loading..." : "Login"}
                </Button>
            </form>
        </div>
    );
}
