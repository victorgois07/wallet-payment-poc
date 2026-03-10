import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

type StartupStatus = 'checking' | 'no-internet' | 'api-unavailable' | 'ready';

export function useStartupChecks() {
  const [status, setStatus] = useState<StartupStatus>('checking');

  const runChecks = useCallback(async () => {
    setStatus('checking');

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      setStatus('no-internet');
      return;
    }

    try {
      await api.get('/health', { timeout: 5_000 });
      setStatus('ready');
    } catch {
      setStatus('api-unavailable');
    }
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  return { status, retry: runChecks };
}
