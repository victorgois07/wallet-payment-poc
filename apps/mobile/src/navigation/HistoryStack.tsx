import { createStackNavigator } from '@react-navigation/stack';
import type React from 'react';
import { HistoryScreen } from '../features/history/HistoryScreen';
import { ResultScreen } from '../features/result/ResultScreen';
import type { HistoryStackParamList } from './types';

const Stack = createStackNavigator<HistoryStackParamList>();

export function HistoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1A237E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
        cardStyle: { backgroundColor: '#F5F5F5' },
      }}
    >
      <Stack.Screen name="HistoryList" component={HistoryScreen} options={{ title: 'Historico' }} />
      <Stack.Screen
        name="HistoryDetail"
        component={ResultScreen as React.ComponentType}
        options={{ title: 'Detalhes' }}
      />
    </Stack.Navigator>
  );
}
