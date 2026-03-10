import type { StepName } from '@wallet/shared';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { STEP_LABELS } from '../../constants/steps';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';

interface StepTimingRowProps {
  step: StepName;
  timeMs: number;
  order: number;
  isComplete?: boolean;
}

export function StepTimingRow({ step, timeMs, order, isComplete = true }: StepTimingRowProps) {
  const label = STEP_LABELS[step] ?? step;
  const timeSec = (timeMs / 1000).toFixed(2);

  return (
    <Animated.View entering={FadeInDown.delay(order * 100).duration(300)}>
      <View
        className="mb-2 flex-row items-center justify-between rounded-md bg-surface px-4 py-3"
        accessibilityRole="text"
        accessibilityLabel={`${label}: ${timeSec} segundos`}
      >
        <View className="flex-1 flex-row items-center gap-2">
          <Icon name={isComplete ? 'check' : 'clock'} size={16} />
          <Text variant="body" className="flex-1" numberOfLines={1}>
            {label}
          </Text>
        </View>
        <Badge label={`${timeSec}s`} variant={isComplete ? 'success' : 'info'} />
      </View>
    </Animated.View>
  );
}
