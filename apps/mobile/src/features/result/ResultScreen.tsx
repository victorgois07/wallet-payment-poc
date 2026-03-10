import type { PaymentStepEvent } from '@wallet/shared';
import { ScrollView, View } from 'react-native';
import { Button, Spinner } from '../../components/atoms';
import { PaymentResult, StepTimingList } from '../../components/organisms';
import { useGetPayment } from '../../hooks/useGetPayment';
import type { PaymentStackScreenProps } from '../../navigation/types';
import { usePaymentStore } from '../../stores/payment.store';

type Props = PaymentStackScreenProps<'Result'>;

export function ResultScreen({ route, navigation }: Props) {
  const { transactionId, payment: routePayment } = route.params;
  const { steps } = usePaymentStore();
  const { data: fetchedPayment, isLoading } = useGetPayment(
    routePayment ? undefined : transactionId,
  );

  const payment = routePayment ?? fetchedPayment;

  if (isLoading || !payment) {
    return <Spinner fullScreen label="Carregando resultado..." />;
  }

  const displaySteps: PaymentStepEvent[] =
    payment.steps.length > 0
      ? payment.steps.map((s, i) => ({
          ...s,
          order: i,
          completedAt: new Date().toISOString(),
        }))
      : steps;

  return (
    <ScrollView className="flex-1 bg-surface-secondary">
      <View className="py-6">
        <PaymentResult payment={payment} />
        <StepTimingList steps={displaySteps} />

        <View className="mt-6 px-4">
          <Button
            title="Novo Pagamento"
            variant="primaryDarkText"
            onPress={() => {
              usePaymentStore.getState().reset();
              navigation.navigate('PaymentTab', { screen: 'Home' });
            }}
            accessibilityHint="Voltar para tela inicial e fazer novo pagamento"
          />
        </View>
      </View>
    </ScrollView>
  );
}
