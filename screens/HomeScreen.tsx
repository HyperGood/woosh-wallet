import { Link, useFocusEffect } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { fetchTransactionsByEthAddress } from '../api/firestoreService';
import Balance from '../components/Balance';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import PreviousTransactions from '../components/transactions/UI/PreviousTransactions';
import { COLORS } from '../constants/global-styles';
import { useAccount } from '../store/SmartAccountContext';

const HomeScreen = () => {
  const [transactions, setTransactions] = useState<any>();
  const { address } = useAccount();

  const requestFunds = async () => {
    console.log('requesting funds');
  };

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
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        <Header />
        <Balance />
        <Skeleton show={!transactions} height={120} width="100%">
          <View style={styles.buttonsContainer}>
            <Button
              title="Request"
              icon="arrow-down-left"
              type="secondary"
              swapIcon
              onPress={requestFunds}
            />
            <Link href="/(app)/send/selectContact" asChild>
              <Button title="Enviar" icon="send" type="primary" onPress={() => {}} />
            </Link>
          </View>
        </Skeleton>
        <Skeleton show={!transactions} height={600} width="100%">
          <PreviousTransactions transactions={transactions} />
        </Skeleton>
      </View>
    </ScrollView>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 72,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 80,
    paddingHorizontal: 12,
  },
});
