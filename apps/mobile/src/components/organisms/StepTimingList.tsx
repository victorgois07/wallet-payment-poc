import type { PaymentStepEvent } from '@wallet/shared';
import { FlatList, View } from 'react-native';
import { Text } from '../atoms/Text';
import { StepTimingRow } from '../molecules/StepTimingRow';

interface StepTimingListProps {
  steps: PaymentStepEvent[];
}

export function StepTimingList({ steps }: StepTimingListProps) {
  if (steps.length === 0) return null;

  return (
    <View className="mt-4" accessibilityRole="list" accessibilityLabel="Etapas do pagamento">
      <Text variant="subheading" className="mb-3 px-4">
        Etapas
      </Text>
      <FlatList
        data={steps}
        keyExtractor={(item, index) => `${item.step}-${item.order ?? index}`}
        renderItem={({ item, index }) => (
          <StepTimingRow
            step={item.step}
            timeMs={item.timeMs}
            order={item.order ?? index}
            isComplete
          />
        )}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
}
