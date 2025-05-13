import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Materi } from "@/types/types.ts"

interface MateriStore {
  materiList: Materi[];
  setMateri: (materi: Materi[]) => void;
}

export const useMateriStore = create<MateriStore>()(
  persist(
    (set) => ({
      materiList: [],
      setMateri: (materi) => set({ materiList: materi }),
    }),
    {
      name: 'materi-storage',
    }
  )
)
