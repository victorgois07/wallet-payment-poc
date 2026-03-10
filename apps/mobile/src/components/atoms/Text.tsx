import type React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

type TextVariant = 'heading' | 'subheading' | 'body' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<TextVariant, string> = {
  heading: 'text-2xl font-bold text-text-primary',
  subheading: 'text-lg font-semibold text-text-primary',
  body: 'text-base text-text-primary',
  caption: 'text-sm text-text-secondary',
  label: 'text-sm font-medium text-text-primary',
};

export function Text({ variant = 'body', className, children, ...props }: TextProps) {
  const combinedClassName = `${variantClasses[variant]} ${className ?? ''}`.trim();
  return (
    <RNText {...({ ...props, className: combinedClassName } as RNTextProps)}>{children}</RNText>
  );
}
