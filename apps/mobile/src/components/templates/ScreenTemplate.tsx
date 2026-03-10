import type React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenTemplateProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  padded?: boolean;
}

export function ScreenTemplate({
  children,
  scrollable = false,
  keyboardAvoiding = false,
  padded = true,
}: ScreenTemplateProps) {
  const content = (
    <View className={`flex-1 bg-white ${padded ? 'px-4 py-6' : ''}`}>{children}</View>
  );

  const scrollContent = scrollable ? (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  const wrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      {scrollContent}
    </KeyboardAvoidingView>
  ) : (
    scrollContent
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      {wrappedContent}
    </SafeAreaView>
  );
}
