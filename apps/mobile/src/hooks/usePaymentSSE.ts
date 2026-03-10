import type { PaymentStepEvent } from '@wallet/shared';
import { useCallback, useEffect, useRef } from 'react';
import { connectPaymentSSE } from '../services/sse';
import { usePaymentStore } from '../stores/payment.store';

export function usePaymentSSE(transactionId: string | null) {
  const connectionRef = useRef<{ close: () => void } | null>(null);
  const { addStep } = usePaymentStore();

  const disconnect = useCallback(() => {
    connectionRef.current?.close();
    connectionRef.current = null;
  }, []);

  useEffect(() => {
    if (!transactionId) return;

    const connection = connectPaymentSSE(
      transactionId,
      (step: PaymentStepEvent) => addStep(step),
      () => disconnect(),
      () => disconnect(),
    );

    connectionRef.current = connection;

    return () => disconnect();
  }, [transactionId, addStep, disconnect]);

  return { disconnect };
}
