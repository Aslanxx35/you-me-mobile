import { create } from 'zustand';

interface State {
  isPremium: boolean;
  expiresAt: string | null;
  willRenew: boolean;
  set: (v: Partial<State>) => void;
}

export const useSubscriptionStore = create<State>((set) => ({
  isPremium: false,
  expiresAt: null,
  willRenew: false,
  set: v => set(v)
}));
