import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {userAuth} from '@/app/api/api-cbt.ts';
import {toast, Toaster} from "sonner";
import {setAccessToken, setRefreshToken, setUserData} from "@/utils/storage.ts";
import LoginLoadingAnimation from "@/components/ui/login-loading.tsx";

const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;
export default function Auth() {
    const {token} = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            if (token) {
                try {
                    setLoading(true);
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
                        setTimeout(() => {
                            window.location.href = LOGOUT_URL;
                        }, 3000);
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
                    setTimeout(() => {
                        window.location.href = LOGOUT_URL;
                    }, 3000);
                }
            }
        })();
    }, [token, navigate]);
    return (
        <div>
            <Toaster position="top-right" richColors/>
            <LoginLoadingAnimation isLoading={loading} text={message}  />
        </div>
    );
}
