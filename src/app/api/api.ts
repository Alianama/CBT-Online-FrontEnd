import {sampleEvents} from "./eventData";
import {users} from "@/app/api/LoginData.ts";
import {Event, User} from "@/types/types.ts";

export const getEvents = (): Promise<Event[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sampleEvents);
        }, 1000);
    });
};
export const getUser = (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(users);
        }, 1000)
    })
}
export const loginUser = (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find((u) => u.username === username && u.password === password);
            if (user) {
                resolve(true);
            } else {
                reject(new Error("Username atau password salah!"));  // Login gagal
            }
        }, 1000);
    });
};