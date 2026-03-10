import { create } from 'zustand';

interface BackdropState {
  requestCount: number;
  isOpen: boolean;

  show: () => void;
  hide: () => void;
}

export const useBackdropStore = create<BackdropState>((set) => ({
  requestCount: 0,
  isOpen: false,

  show: () =>
    set((state) => {
      const requestCount = state.requestCount + 1;
      return { requestCount, isOpen: true };
    }),

  hide: () =>
    set((state) => {
      const requestCount = Math.max(0, state.requestCount - 1);
      return { requestCount, isOpen: requestCount > 0 };
    }),
}));
