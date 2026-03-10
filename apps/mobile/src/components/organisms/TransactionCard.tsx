import type { PaymentResponse, PaymentStatus } from '@wallet/shared';
import { Pressable, View } from 'react-native';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';

interface TransactionCardProps {
  payment: PaymentResponse;
  onPress: () => void;
}

const statusVariant: Record<PaymentStatus, 'success' | 'error' | 'warning' | 'info'> = {
  approved: 'success',
  refused: 'error',
  error: 'error',
};

export function TransactionCard({ payment, onPress }: TransactionCardProps) {
  const date = payment.createdAt
    ? new Date(payment.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-lg bg-surface p-4 active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel={`Transacao ${payment.transactionId}, ${payment.status}${payment.amount != null ? `, R$ ${payment.amount.toFixed(2)}` : ''}`}
      accessibilityHint="Toque para ver detalhes"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Icon name="credit-card" size={16} />
            <Text variant="body" className="font-semibold">
              R$ {payment.amount != null ? payment.amount.toFixed(2) : '—'}
            </Text>
          </View>
          <Text variant="caption" className="mt-1">
            {payment.transactionId.slice(0, 20)}...
          </Text>
          <Text variant="caption">{date}</Text>
        </View>
        <View className="items-end gap-1">
          <Badge label={payment.status} variant={statusVariant[payment.status]} />
          <Text variant="caption">{(payment.totalTimeMs / 1000).toFixed(2)}s</Text>
        </View>
      </View>
    </Pressable>
  );
}
