import { Link, useFocusEffect } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchTransactionsByEthAddress } from '../api/firestoreService';
import Balance from '../components/Balance';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import PreviousTransactions from '../components/transactions/UI/PreviousTransactions';
import { COLORS } from '../constants/global-styles';
import i18n from '../constants/i18n';
import { useAccount } from '../store/SmartAccountContext';
import { scale } from '../utils/scalingFunctions';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<any>();
  const { address } = useAccount();

  useFocusEffect(
    useCallback(() => {
      if (!address) {
        console.log('No address found');
        return;
      }
      (async () => {
        const transactions = await fetchTransactionsByEthAddress(address);
        setTransactions(transactions);
      })();
    }, [address])
  );

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}>
        <Header />
        <Balance />
        <Skeleton show={!transactions} height={120} width="100%">
          <View style={styles.buttonsContainer}>
            <Link href="/(app)/request/enterAmount" asChild>
              <Button
                title={i18n.t('request')}
                icon="arrow-down-left"
                type="secondary"
                swapIcon
                onPress={() => {}}
              />
            </Link>
            <Link href="/(app)/send/selectContact" asChild>
              <Button title={i18n.t('send')} icon="send" type="primary" onPress={() => {}} />
            </Link>
          </View>
        </Skeleton>
        <Skeleton show={!transactions} height={600} width="100%">
          <PreviousTransactions transactions={transactions} />
        </Skeleton>
      </ScrollView>
    </View>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.primary[400],
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: scale(48),
    paddingHorizontal: 12,
  },
});
