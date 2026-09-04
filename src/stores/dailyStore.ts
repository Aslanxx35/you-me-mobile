import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DailyReading {
  date: string;
  content: string;
  sign?: string;
}

interface DailyState {
  todayReading: DailyReading | null;
  isLoading: boolean;
  lastFetched: string | null;
  setTodayReading: (reading: DailyReading) => void;
  setLoading: (loading: boolean) => void;
  clearReading: () => void;
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set) => ({
      todayReading: null,
      isLoading: false,
      lastFetched: null,
      
      setTodayReading: (reading) => set({ 
        todayReading: reading, 
        lastFetched: new Date().toISOString().split('T')[0],
        isLoading: false 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      clearReading: () => set({ todayReading: null }),
    }),
    {
      name: 'daily-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
