import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../features/home/HomeScreen';
import { PaymentScreen } from '../features/payment/PaymentScreen';
import { ResultScreen } from '../features/result/ResultScreen';
import type { PaymentStackParamList } from './types';

const Stack = createStackNavigator<PaymentStackParamList>();

export function PaymentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1A237E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
        cardStyle: { backgroundColor: '#F5F5F5' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Wallet' }} />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: 'Novo Pagamento',
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Resultado', headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
}
