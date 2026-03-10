import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Text } from '../../components/atoms';
import { toast } from '../../components/molecules/Toast';
import { PaymentForm, type PaymentFormData } from '../../components/organisms';
import { useCreatePayment } from '../../hooks/useCreatePayment';
import type { PaymentStackScreenProps } from '../../navigation/types';
import { usePaymentStore } from '../../stores/payment.store';

type Props = PaymentStackScreenProps<'Payment'>;

export function PaymentScreen({ navigation }: Props) {
  const mutation = useCreatePayment();
  const error = usePaymentStore((state) => state.error);

  const handleSubmit = (data: PaymentFormData) => {
    const amount = Number(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));

    mutation.mutate(
      {
        cardNumber: data.cardNumber.replace(/\s/g, ''),
        cardholderName: data.holderName.trim(),
        expirationDate: data.expirationDate,
        cvv: data.cvv,
        amount,
      },
      {
        onSuccess: (payment) => {
          navigation.navigate('Result', {
            transactionId: payment.transactionId,
            payment,
          });
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'Erro ao processar pagamento';
          toast.show({
            type: 'error',
            text1: 'Pagamento falhou',
            text2: message,
          });
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-secondary"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {error !== null ? (
          <View className="mx-4 mt-4 rounded-lg bg-red-100 px-4 py-3" accessibilityRole="alert">
            <Text variant="label" className="text-red-800">
              {error}
            </Text>
          </View>
        ) : null}
        <PaymentForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
