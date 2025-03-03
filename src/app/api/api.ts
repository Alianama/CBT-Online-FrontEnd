// src/api.ts
import {events} from "./events/data";
import {Event} from "@/types/event.ts";
// Fungsi untuk mengambil data event (dengan delay untuk simulasi async)
export const getEvents = (): Promise<Event[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(events);
        }, 500); // Delay 500ms seperti loading data asli
    });
};
