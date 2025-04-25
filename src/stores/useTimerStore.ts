import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
    timer: number;
    setTimer: (value: number) => void;
    resetTimer: () => void;
}

const useTimerStore = create<TimerState>()(
    persist(
        (set) => ({
            timer: 0,
            setTimer: (value) => set({ timer: value }),
            resetTimer: () => set({ timer: 0 }),
        }),
        {
            name: 'soal-timer',
        }
    )
);

export default useTimerStore;
