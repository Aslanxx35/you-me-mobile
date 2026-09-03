import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChartData {
  planets?: Record<string, { sign: string; degree: number; house: number }> | any[];
  houses?: Record<number, { sign: string; degree: number }> | any[];
  ascendant?: string;
  midheaven?: string;
  sunSign?: string;
  sunSignTR?: string;
}

interface ChartState {
  natalChart: ChartData | null;
  isLoading: boolean;
  error: string | null;
  setNatalChart: (data: ChartData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChart: () => void;
}

export const useChartStore = create<ChartState>()(
  persist(
    (set) => ({
      natalChart: null,
      isLoading: false,
      error: null,
      
      setNatalChart: (data) => set({ natalChart: data, error: null }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearChart: () => set({ natalChart: null, error: null }),
    }),
    {
      name: 'chart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
