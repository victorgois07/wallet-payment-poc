import type { PaymentResponse } from '@wallet/shared';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Badge } from '../atoms/Badge';
import { Text } from '../atoms/Text';
import { StatusBadge } from '../molecules/StatusBadge';

interface PaymentResultProps {
  payment: PaymentResponse;
}

export function PaymentResult({ payment }: PaymentResultProps) {
  const totalSec = (payment.totalTimeMs / 1000).toFixed(2);

  return (
    <Animated.View entering={FadeInUp.duration(500)}>
      <View
        className="items-center rounded-lg bg-surface p-6"
        accessibilityRole="summary"
        accessibilityLabel={`Pagamento ${payment.status}, tempo total ${totalSec} segundos`}
      >
        <StatusBadge status={payment.status} />

        {payment.amount != null && (
          <Text variant="heading" className="mt-4">
            R$ {payment.amount.toFixed(2)}
          </Text>
        )}

        <Text variant="caption" className="mt-1">
          {payment.transactionId}
        </Text>

        <View className="mt-4 flex-row gap-3">
          <Badge label={`${totalSec}s`} variant="info" />
          <Badge label={payment.strategy} variant="neutral" />
        </View>

        {payment.cardLastFour && (
          <Text variant="caption" className="mt-2">
            Cartao •••• {payment.cardLastFour}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}
