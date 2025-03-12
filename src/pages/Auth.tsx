import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {userAuth} from '@/app/api/api-cbt.ts';
import {toast, Toaster} from "sonner";
import {setAccessToken, setRefreshToken, setUserData} from "@/utils/storage.ts";
import logo from "@/assets/Image/Logo.png";

const LOGIN_URL: string = import.meta.env.VITE_LOGIN_URL;
const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;
export default function Auth() {
    const {token} = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        (async () => {
            if (token) {
                try {
                    const response = await userAuth(token);
                    if (response) {
                        const {access_token, refresh_token, user_data} = response;
                        setAccessToken(access_token)
                        setRefreshToken(refresh_token)
                        setUserData(user_data)
                        console.log('✅ User authenticated:', response);
                        setMessage('Authentication successful! 🎉');
                        toast.success("Login success!");
                        setTimeout(() => {
                            navigate('/');
                        }, 1000);
                    } else {
                        console.warn('⚠️ Authentication failed:', response);
                        setMessage('Authentication failed! Invalid response.');
                        toast.error('Login failed. Invalid response.');
                        window.location.href = LOGOUT_URL;
                    }
                } catch (error) {
                    console.error('❌ Authentication error:', error);
                    if (error) {
                        setMessage(`Authentication failed! ${error ?? 'Unknown error'}`);
                        toast.error('Login failed.');
                    } else {
                        setMessage('Authentication error! Please try again.');
                        toast.error('Login error! Something went wrong.');
                    }
                }
            }
        })();
    }, [token, navigate]);
    const onLogin = () => {
        window.location.href = LOGIN_URL
    }
    return (
        <div>
            <Toaster position="top-right" richColors/>
            <div className="w-full h-screen text-center flex flex-col p-10 items-center justify-center gap-10">
                <h1 className="text-2xl font-bold max-md:text-lg">
                    WELCOME BACK! <br/> SMA N 8 TAMBUN SELATAN
                </h1>

                <p>{message}</p>
                <img src={logo} alt="logo" className="w-1/2"/>

                <button className="bg-primary text-secondary p-4 rounded-full shadow-xl" onClick={onLogin}>Back to
                    Login
                </button>

            </div>
        </div>
    );
}
