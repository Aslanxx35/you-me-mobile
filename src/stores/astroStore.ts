import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JungResult {
  dominant: string;
  secondary: string;
  scores: Record<string, number>;
}

interface BirthData {
  sign?: string;
  moonSign?: string;
  ascendant?: string;
}

interface AstroState {
  jungResult: JungResult | null;
  birthData: BirthData | null;
  setJungResult: (result: JungResult) => void;
  setBirthData: (data: BirthData) => void;
  clearJungResult: () => void;
}

export const useAstroStore = create<AstroState>()(
  persist(
    (set) => ({
      jungResult: null,
      birthData: null,

      setJungResult: (result) => set({ jungResult: result }),
      setBirthData: (data) => set({ birthData: data }),

      clearJungResult: () => set({ jungResult: null }),
    }),
    {
      name: 'astro-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
