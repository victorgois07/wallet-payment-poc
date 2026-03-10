import { forwardRef } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, disabled, className, ...props }, ref) => {
    const borderColor = error ? 'border-error' : 'border-surface-tertiary focus:border-primary';

    return (
      <View className="mb-3">
        {label && (
          <Text variant="label" className="mb-1">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={`h-12 rounded-md border bg-surface px-4 text-base text-text-primary ${borderColor} ${
            disabled ? 'opacity-50' : ''
          } ${className ?? ''}`}
          editable={!disabled}
          placeholderTextColor="#BDBDBD"
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          accessibilityHint={error ? `Erro: ${error}` : undefined}
          {...props}
        />
        {error && (
          <Text variant="caption" className="mt-1 text-error" accessibilityRole="alert">
            {error}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
