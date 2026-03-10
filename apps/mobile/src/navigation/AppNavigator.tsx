import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { colors } from '../theme/tokens';
import { HistoryStack } from './HistoryStack';
import { PaymentStack } from './PaymentStack';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icon = label === 'Pagamento' ? '💳' : '📋';
  return (
    <Text
      style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      {icon}
    </Text>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary.DEFAULT,
          tabBarInactiveTintColor: colors.text.secondary,
          tabBarStyle: {
            backgroundColor: colors.surface.DEFAULT,
            borderTopColor: colors.surface.tertiary,
          },
        }}
      >
        <Tab.Screen
          name="PaymentTab"
          component={PaymentStack}
          options={{
            tabBarLabel: 'Pagamento',
            tabBarIcon: ({ focused }) => <TabIcon label="Pagamento" focused={focused} />,
            tabBarAccessibilityLabel: 'Aba de pagamento',
          }}
        />
        <Tab.Screen
          name="HistoryTab"
          component={HistoryStack}
          options={{
            tabBarLabel: 'Historico',
            tabBarIcon: ({ focused }) => <TabIcon label="Historico" focused={focused} />,
            tabBarAccessibilityLabel: 'Aba de historico de pagamentos',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
