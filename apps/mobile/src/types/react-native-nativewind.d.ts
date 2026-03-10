import type {} from 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
    cssInterop?: boolean;
  }

  interface TextProps {
    className?: string;
    cssInterop?: boolean;
  }

  interface TextInputProps {
    placeholderClassName?: string;
    className?: string;
    cssInterop?: boolean;
  }

  interface ScrollViewProps {
    contentContainerClassName?: string;
    indicatorClassName?: string;
  }

  interface KeyboardAvoidingViewProps {
    contentContainerClassName?: string;
  }

  interface ImagePropsBase {
    className?: string;
    cssInterop?: boolean;
  }
}
