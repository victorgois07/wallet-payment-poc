import type { PaymentStatus } from '@wallet/shared';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icon';

interface StatusBadgeProps {
  status: PaymentStatus;
}

const statusConfig: Record<
  PaymentStatus,
  { icon: string; variant: 'success' | 'error' | 'warning' | 'info' }
> = {
  approved: { icon: 'check', variant: 'success' },
  refused: { icon: 'error', variant: 'error' },
  error: { icon: 'warning', variant: 'error' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <View
        className="flex-row items-center gap-2"
        accessibilityRole="text"
        accessibilityLabel={`Status: ${status}`}
      >
        <Icon name={config.icon} size={18} />
        <Badge label={status} variant={config.variant} />
      </View>
    </Animated.View>
  );
}
