import type { PaymentResponse, PaymentStepEvent } from '@wallet/shared';
import { create } from 'zustand';

interface PaymentState {
  isProcessing: boolean;
  currentTransactionId: string | null;
  steps: PaymentStepEvent[];
  payment: PaymentResponse | null;
  error: string | null;

  startProcessing: (transactionId: string) => void;
  addStep: (step: PaymentStepEvent) => void;
  setPayment: (payment: PaymentResponse) => void;
  setError: (error: string) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  isProcessing: false,
  currentTransactionId: null,
  steps: [] as PaymentStepEvent[],
  payment: null as PaymentResponse | null,
  error: null as string | null,
};

export const usePaymentStore = create<PaymentState>((set) => ({
  ...initialState,

  startProcessing: (transactionId: string) =>
    set({
      isProcessing: true,
      currentTransactionId: transactionId,
      steps: [],
      payment: null,
      error: null,
    }),

  addStep: (step: PaymentStepEvent) =>
    set((state) => ({
      steps: [...state.steps, step].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    })),

  setPayment: (payment: PaymentResponse) =>
    set({
      isProcessing: false,
      payment,
    }),

  setError: (error: string) =>
    set({
      isProcessing: false,
      error,
    }),

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
