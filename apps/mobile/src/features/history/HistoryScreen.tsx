import { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Spinner, Text } from '../../components/atoms';
import { TransactionCard } from '../../components/organisms';
import { useListPayments } from '../../hooks/useListPayments';
import type { HistoryStackScreenProps } from '../../navigation/types';
import { colors } from '../../theme/tokens';

type Props = HistoryStackScreenProps<'HistoryList'>;

export function HistoryScreen({ navigation }: Props) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    useListPayments();

  const payments = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <Spinner fullScreen label="Carregando historico..." />;
  }

  return (
    <FlatList
      data={payments}
      keyExtractor={(item) => item.transactionId}
      renderItem={({ item }) => (
        <TransactionCard
          payment={item}
          onPress={() =>
            navigation.navigate('HistoryDetail', { transactionId: item.transactionId })
          }
        />
      )}
      contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary.DEFAULT}
        />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={isFetchingNextPage ? <Spinner label="Carregando mais..." /> : null}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center">
          <Text variant="body" className="text-text-secondary">
            Nenhum pagamento realizado ainda.
          </Text>
          <Text variant="caption" className="mt-1">
            Faca um pagamento na aba Pagamento.
          </Text>
        </View>
      }
    />
  );
}
