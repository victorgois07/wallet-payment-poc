import { ActivityIndicator, Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'primaryDarkText' | 'secondary' | 'ghost';

/** Pressable props plus NativeWind's className (not in RN types). */
type PressablePropsWithClassName = PressableProps & { className?: string };

interface ButtonProps extends Omit<PressablePropsWithClassName, 'children'> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

const variantStyles: Record<
  ButtonVariant,
  { container: string; text: string; loaderColor: string }
> = {
  primary: {
    container: 'bg-primary rounded-md h-12 items-center justify-center flex-row',
    text: 'text-base font-semibold text-text-inverse',
    loaderColor: '#FFFFFF',
  },
  primaryDarkText: {
    container: 'bg-primary rounded-md h-12 items-center justify-center flex-row',
    text: 'text-base font-semibold text-text-primary text-white',
    loaderColor: '#1A237E',
  },
  secondary: {
    container:
      'bg-surface border border-primary rounded-md h-12 items-center justify-center flex-row',
    text: 'text-base font-semibold text-text-primary text-[#fff]',
    loaderColor: '#1A237E',
  },
  ghost: {
    container: 'bg-transparent rounded-md h-12 items-center justify-center flex-row',
    text: 'text-base font-semibold text-text-primary text-[#fff]',
    loaderColor: '#1A237E',
  },
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  const pressableProps: PressablePropsWithClassName = {
    disabled: isDisabled,
    accessibilityRole: 'button',
    accessibilityLabel: title,
    accessibilityState: { disabled: isDisabled, busy: loading },
    className: `${styles.container} ${isDisabled ? 'opacity-50' : ''}`,
    style: style as ViewStyle,
    ...props,
  };

  return (
    <Pressable {...(pressableProps as PressableProps)}>
      {loading && <ActivityIndicator color={styles.loaderColor} style={{ marginRight: 8 }} />}
      <Text className={styles.text}>{title}</Text>
    </Pressable>
  );
}
