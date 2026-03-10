import { View } from 'react-native';
import { Button, Icon, Text } from '../../components/atoms';
import type { PaymentStackScreenProps } from '../../navigation/types';

type Props = PaymentStackScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-surface-secondary px-6">
      <View className="items-center">
        <Icon name="credit-card" size={64} />
        <Text variant="heading" className="mt-6 text-center">
          Wallet Payment
        </Text>
        <Text variant="body" className="mt-2 text-center text-text-secondary">
          PoC de pagamento com cartao de credito.{'\n'}Processamento paralelo com feedback em tempo
          real.
        </Text>
      </View>

      <View className="mt-10 w-full">
        <Button
          variant="primaryDarkText"
          title="Novo Pagamento"
          onPress={() => navigation.navigate('Payment')}
          accessibilityHint="Iniciar um novo pagamento com cartao"
        />
      </View>

      <View className="mt-8 rounded-lg bg-primary-50 p-4">
        <Text variant="caption" className="text-center text-primary">
          Case Tecnico — Riachuelo / Midway{'\n'}Pipeline 6 etapas | CQRS | SSE Real-time
        </Text>
      </View>
    </View>
  );
}
