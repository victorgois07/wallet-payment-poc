import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { PaymentResponse } from '@wallet/shared';

// --- Stack Param Lists ---

export type PaymentStackParamList = {
  Home: undefined;
  Payment: undefined;
  Result: { transactionId: string; payment?: PaymentResponse };
};

export type HistoryStackParamList = {
  HistoryList: undefined;
  HistoryDetail: { transactionId: string };
};

// --- Tab Param List ---

export type RootTabParamList = {
  PaymentTab: NavigatorScreenParams<PaymentStackParamList>;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
};

// --- Screen Props ---

export type PaymentStackScreenProps<T extends keyof PaymentStackParamList> = CompositeScreenProps<
  StackScreenProps<PaymentStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type HistoryStackScreenProps<T extends keyof HistoryStackParamList> = CompositeScreenProps<
  StackScreenProps<HistoryStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;
