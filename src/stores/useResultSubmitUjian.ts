import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Result {
    benar: number;
    salah: number;
    kosong: number;
    total: number;
    nilai: number;
    setResult: (data: Partial<Result>) => void;
    resetResult: () => void;
}

const useResultSubmitUjian = create<Result>()(
    persist(
        (set) => ({
            benar: 0,
            salah: 0,
            kosong: 0,
            total: 0,
            nilai: 0,
            setResult: (data: Partial<Result>) => set((state) => ({ ...state, ...data })),
            resetResult: () =>
                set({
                    benar: 0,
                    salah: 0,
                    kosong: 0,
                    total: 0,
                    nilai: 0,
                }),
        }),
        {
            name: "hasil-ujian",
        }
    )
);

export default useResultSubmitUjian;
