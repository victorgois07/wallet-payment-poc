import { Text as RNText } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const iconMap: Record<string, string> = {
  'credit-card': '💳',
  check: '✅',
  error: '❌',
  clock: '⏱️',
  refresh: '🔄',
  home: '🏠',
  list: '📋',
  chevron: '›',
  warning: '⚠️',
  shield: '🛡️',
  send: '📤',
  dollar: '💰',
};

export function Icon({ name, size = 20, color }: IconProps) {
  const emoji = iconMap[name] ?? '•';

  return (
    <RNText
      style={{ fontSize: size, color }}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      {emoji}
    </RNText>
  );
}
