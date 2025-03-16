"use client"
import {useEffect, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Card, CardContent} from "@/components/ui/card"
import {CheckCircle} from "lucide-react"
import {getAuthData} from "@/utils/storage.ts";
import {UserData} from "@/types/types.ts";
import { clearAuthData} from "@/utils/storage.ts";

const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL
export default function LogoutAnimation() {
    const [stage, setStage] = useState<"profile" | "loading" | "success">("profile")
    useEffect(() => {
        setStage("profile")
        const loadingTimer = setTimeout(() => {
            clearAuthData()
            console.log()
            setStage("loading")
        }, 1000)
        const successTimer = setTimeout(() => {
            setStage("success")
        }, 2000)
        const redirectTimer = setTimeout(() => {
            window.location.href = LOGOUT_URL
        }, 4000)
        return () => {
            clearTimeout(loadingTimer)
            clearTimeout(successTimer)
            clearTimeout(redirectTimer)
        }
    }, [])
    const userData = getAuthData()?.userData || {} as UserData;
    const getInitials = (name: string) => {
        const words = name.split(" ");
        return words.length === 1
            ? name.charAt(0).toUpperCase()
            : (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <Card className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-xl">
                <CardContent className="flex flex-col items-center justify-center p-8 h-[400px] relative">
                    <AnimatePresence mode="wait">
                        {stage === "profile" && (
                            <motion.div
                                key="profile"
                                className="flex flex-col items-center gap-4"
                                initial={{opacity: 1, y: 0}}
                                exit={{
                                    opacity: 0,
                                    y: -40,
                                    scale: 0.9,
                                    transition: {
                                        duration: 0.5,
                                        ease: [0.76, 0, 0.24, 1],
                                    },
                                }}
                            >
                                <motion.div
                                    initial={{scale: 1}}
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        transition: {
                                            repeat: 0,
                                            duration: 0.8,
                                        },
                                    }}
                                >
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                        <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User"/>
                                        <AvatarFallback
                                            className="text-3xl">{getInitials(userData.nama)}</AvatarFallback>
                                    </Avatar>
                                </motion.div>
                                <div className="text-center">
                                    <h3 className="text-xl font-medium">{userData.nama}</h3>
                                </div>
                            </motion.div>
                        )}

                        {stage === "loading" && (
                            <motion.div
                                key="loading"
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.3}}
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-slate-200 rounded-full"></div>
                                    <div
                                        className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                                </div>
                                <motion.div
                                    className="absolute inset-0 bg-white/80"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.5, duration: 0.5}}
                                />
                            </motion.div>
                        )}

                        {stage === "success" && (
                            <motion.div
                                key="success"
                                className="flex flex-col items-center gap-6"
                                initial={{opacity: 0, scale: 0.8}}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: {
                                        delay: 0.2,
                                        duration: 0.5,
                                        ease: [0.22, 1, 0.36, 1],
                                    },
                                }}
                            >
                                <motion.div
                                    initial={{scale: 0}}
                                    animate={{
                                        scale: 1,
                                        transition: {
                                            delay: 0.5,
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 10,
                                        },
                                    }}
                                >
                                    <CheckCircle className="h-32 w-32 text-primary" strokeWidth={1.5}/>
                                </motion.div>
                                <motion.div
                                    initial={{opacity: 0, y: 20}}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {delay: 0.8, duration: 0.5},
                                    }}
                                    className="text-center"
                                >
                                    <h3 className="text-2xl font-medium text-slate-800">Logged Out</h3>
                                    <p className="text-slate-500 mt-2 max-w-[250px]">
                                        You have been successfully logged out of your account
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}

