import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { userAuth } from '@/app/api/api-cbt.ts';
import { toast, Toaster } from "sonner";
import { setAuthData } from "@/utils/storage.ts";

export default function Auth() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        (async () => {
            if (token) {
                try {
                    const response = await userAuth(token);
                    if (response) {
                        const { access_token, refresh_token, user_data } = response;
                        setAuthData(access_token, refresh_token, user_data);
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

    return (
      <div>
          <Toaster position="top-right" richColors />
          <h1>{token}</h1>
          <p>{message}</p>
      </div>
    );
}
