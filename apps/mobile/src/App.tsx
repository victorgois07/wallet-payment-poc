import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Backdrop, Toast } from './components/molecules';
import { SplashScreen } from './features/splash/SplashScreen';
import { useStartupChecks } from './hooks/useStartupChecks';
import { AppNavigator } from './navigation/AppNavigator';

import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function App() {
  const { status, retry } = useStartupChecks();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {status === 'ready' ? (
            <>
              <AppNavigator />
              <Backdrop />
              <Toast />
            </>
          ) : (
            <SplashScreen status={status} onRetry={retry} />
          )}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
