import { ActivityIndicator, type ActivityIndicatorProps, View } from 'react-native';
import { colors } from '../../theme/tokens';
import { Text } from './Text';

interface SpinnerProps extends ActivityIndicatorProps {
  label?: string;
  fullScreen?: boolean;
}

export function Spinner({
  label,
  fullScreen = false,
  size = 'large',
  color = colors.primary.DEFAULT,
  ...props
}: SpinnerProps) {
  const content = (
    <View className="items-center justify-center p-4" accessibilityRole="progressbar">
      <ActivityIndicator size={size} color={color} {...props} />
      {label && (
        <Text variant="caption" className="mt-2">
          {label}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return <View className="flex-1 items-center justify-center bg-surface">{content}</View>;
  }

  return content;
}
