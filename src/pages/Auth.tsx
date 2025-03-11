import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {userAuth} from '@/app/api/api-cbt.ts';
import {toast, Toaster} from "sonner";
import {setAuthData} from "@/utils/storage.ts";

export default function Auth() {
    const {token} = useParams();
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        (async () => {
            if (token) {
                try {
                    const response = await userAuth(token);
                    if (response.status === 200) {
                        const {access_token, refresh_token, user_data} = response.data; // 🔥 Ambil data dari response
                        setAuthData(access_token, refresh_token, user_data);
                        console.log('User authenticated:', response);
                        setMessage('Authentication successful! 🎉');
                        toast.success("Login success!");
                    } else {
                        console.warn('Authentication failed with status:', response.status);
                        setMessage(`Authentication failed! Status: ${response.status}`);
                        toast.error(`Login failed with status: ${response.status}`);
                    }
                } catch (error) {
                    console.error('Authentication failed:', error);
                    setMessage('Authentication error! ❌');
                    toast.error(error instanceof Error ? error.message : "Login Error!");
                }
            }
        })();
    }, [token]);
    return (
        <div>
            <Toaster position="top-right" richColors/>
            <h1>{token}</h1>
            <p>{message}</p>
        </div>
    );
}
