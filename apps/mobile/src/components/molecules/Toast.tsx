import { View } from 'react-native';
import ToastMessage, { type ToastConfig, type ToastConfigParams } from 'react-native-toast-message';
import { Text } from '../atoms';

function SuccessToast({ text1, text2 }: ToastConfigParams<unknown>) {
  return (
    <View
      className="mx-4 mt-2 rounded-lg bg-green-600 px-4 py-3 shadow-lg"
      accessibilityRole="alert"
      accessibilityLabel={`Sucesso: ${text1}`}
    >
      <Text variant="label" className="text-white font-bold">
        {text1}
      </Text>
      {text2 ? (
        <Text variant="caption" className="text-green-100 mt-1">
          {text2}
        </Text>
      ) : null}
    </View>
  );
}

function ErrorToast({ text1, text2 }: ToastConfigParams<unknown>) {
  return (
    <View
      className="mx-4 mt-2 rounded-lg bg-red-600 px-4 py-3 shadow-lg"
      accessibilityRole="alert"
      accessibilityLabel={`Erro: ${text1}`}
    >
      <Text variant="label" className="text-white font-bold">
        {text1}
      </Text>
      {text2 ? (
        <Text variant="caption" className="text-red-100 mt-1">
          {text2}
        </Text>
      ) : null}
    </View>
  );
}

function InfoToast({ text1, text2 }: ToastConfigParams<unknown>) {
  return (
    <View
      className="mx-4 mt-2 rounded-lg bg-indigo-900 px-4 py-3 shadow-lg"
      accessibilityRole="alert"
      accessibilityLabel={text1 ?? ''}
    >
      <Text variant="label" className="text-white font-bold">
        {text1}
      </Text>
      {text2 ? (
        <Text variant="caption" className="text-indigo-200 mt-1">
          {text2}
        </Text>
      ) : null}
    </View>
  );
}

const toastConfig: ToastConfig = {
  success: SuccessToast,
  error: ErrorToast,
  info: InfoToast,
};

export function Toast() {
  return <ToastMessage config={toastConfig} />;
}

export { ToastMessage as toast };
