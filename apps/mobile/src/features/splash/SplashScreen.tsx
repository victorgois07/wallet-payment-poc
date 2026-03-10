import { View } from 'react-native';
import { Button } from '../../components/atoms/Button';
import { Spinner } from '../../components/atoms/Spinner';
import { Text } from '../../components/atoms/Text';
import type { useStartupChecks } from '../../hooks/useStartupChecks';

interface SplashScreenProps {
  status: ReturnType<typeof useStartupChecks>['status'];
  onRetry: () => void;
}

export function SplashScreen({ status, onRetry }: SplashScreenProps) {
  if (status === 'checking') {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <Text variant="heading" className="mb-4 text-primary">
          Wallet Payment
        </Text>
        <Spinner label="Verificando conexão..." />
      </View>
    );
  }

  const isNoInternet = status === 'no-internet';
  const title = isNoInternet ? 'Sem conexão com a internet' : 'Serviço indisponível';
  const message = isNoInternet
    ? 'Verifique sua conexão de internet e tente novamente.'
    : 'O serviço está temporariamente indisponível. Tente novamente em alguns instantes.';

  return (
    <View className="flex-1 items-center justify-center bg-surface px-8">
      <Text variant="heading" className="mb-2 text-center text-error">
        {title}
      </Text>
      <Text variant="body" className="mb-8 text-center text-text-secondary">
        {message}
      </Text>
      <Button title="Tentar novamente" variant="primary" onPress={onRetry} />
    </View>
  );
}
