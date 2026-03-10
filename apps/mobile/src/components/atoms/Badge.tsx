import { View } from 'react-native';
import { Text } from './Text';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: 'bg-success/10', text: 'text-success-dark' },
  error: { bg: 'bg-error/10', text: 'text-error-dark' },
  warning: { bg: 'bg-warning/10', text: 'text-warning-dark' },
  info: { bg: 'bg-primary-50', text: 'text-primary' },
  neutral: { bg: 'bg-surface-tertiary', text: 'text-text-secondary' },
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const styles = variantClasses[variant];

  return (
    <View
      className={`rounded-xl px-3 py-1 ${styles.bg}`}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text className={`text-xs font-semibold ${styles.text}`}>{label}</Text>
    </View>
  );
}
