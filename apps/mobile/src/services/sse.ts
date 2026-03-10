import type { PaymentSseEvent, PaymentStepEvent } from '@wallet/shared';
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

type SseCallback = (event: PaymentStepEvent) => void;
type SseCompleteCallback = () => void;
type SseErrorCallback = (error: Error) => void;

interface SseConnection {
  close: () => void;
}

function parseSseLine(line: string): PaymentSseEvent | null {
  if (!line.startsWith('data: ')) return null;
  try {
    return JSON.parse(line.slice(6)) as PaymentSseEvent;
  } catch {
    return null;
  }
}

function handleSseEvent(
  data: PaymentSseEvent,
  onStep: SseCallback,
  onComplete: SseCompleteCallback,
): boolean {
  if (data.type === 'step_completed') {
    onStep(data.data as PaymentStepEvent);
    return false;
  }
  if (data.type === 'payment_completed') {
    onComplete();
    return true;
  }
  return false;
}

async function consumeStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
  onStep: SseCallback,
  onComplete: SseCompleteCallback,
  isAborted: () => boolean,
): Promise<void> {
  let buffer = '';
  while (!isAborted()) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const data = parseSseLine(line);
      if (data === null) continue;
      const finished = handleSseEvent(data, onStep, onComplete);
      if (finished) return;
    }
  }
}

export function connectPaymentSSE(
  transactionId: string,
  onStep: SseCallback,
  onComplete: SseCompleteCallback,
  onError: SseErrorCallback,
): SseConnection {
  const url = `${BASE_URL}/v1/payments/${transactionId}/events`;
  let aborted = false;
  const controller = new AbortController();

  (async () => {
    try {
      const init: RequestInit = {
        headers: { Accept: 'text/event-stream' },
        signal: controller.signal,
      };
      const response = await fetch(url, init);

      if (!response.ok || !response.body) {
        onError(new Error(`SSE connection failed: ${response.status}`));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      await consumeStream(reader, decoder, onStep, onComplete, () => aborted);
    } catch (err) {
      if (!aborted) {
        onError(err instanceof Error ? err : new Error('SSE error'));
      }
    }
  })();

  return {
    close() {
      aborted = true;
      controller.abort();
    },
  };
}
