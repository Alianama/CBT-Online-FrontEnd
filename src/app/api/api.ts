import {BookCardProps} from "@/types/types.ts";
import {books} from "@/app/api/bookData.ts";
// export const getEvents = (): Promise<Event[]> => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(sampleEvents);
//         }, 1000);
//     });
// };
// export const getUser = (): Promise<User[]> => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(users);
//         }, 1000)
//     })
// }
// export const loginUser = (username: string, password: string): Promise<boolean> => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             const user = users.find((u) => u.username === username && u.password === password);
//             if (user) {
//                 resolve(true);
//             } else {
//                 reject(new Error("Username atau password salah!"));
//             }
//         }, 1000);
//     });
// };
export const getBooks = (): Promise<BookCardProps[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books);
        }, 1000)
    })
}

