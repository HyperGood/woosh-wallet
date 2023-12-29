import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { parseEther, zeroAddress } from 'viem';

import { fetchTransactions } from '../api/firestoreService';
import Balance from '../components/Balance';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import PreviousTransactions from '../components/transactions/UI/PreviousTransactions';
import { COLORS } from '../constants/global-styles';
import { useAccount } from '../store/SmartAccountContext';

const HomeScreen = () => {
  const [transactions, setTransactions] = useState<any>();
  const { ecdsaProvider } = useAccount();

  //Deploy Account
  const deployAccount = async () => {
    try {
      if (!ecdsaProvider) throw new Error('No ecdsaProvider');
      const { hash } = await ecdsaProvider.sendUserOperation({
        target: '0x2825D34D84528ABD8fDCE7Ce42Ad89e1B912a2c0',
        value: parseEther('0.003'),
        data: '0x',
      });
      console.log('User Op Hash: ', hash);
      Alert.alert('Transaction Successful!! User Op Hash: ', hash);
    } catch (e) {
      console.log(e);
      Alert.alert('Transaction Failed!!');
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const transactions = await fetchTransactions();
        setTransactions(transactions);
      })();
    }, [])
  );

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        <Header />
        <Balance />
        <View style={styles.buttonsContainer}>
          <Button
            title="Exit"
            icon="arrow-down-left"
            type="secondary"
            swapIcon
            onPress={deployAccount}
          />
          <Link href="/(app)/send/selectContact" asChild>
            <Button title="Enviar" icon="send" type="primary" onPress={() => {}} />
          </Link>
        </View>
        <PreviousTransactions transactions={transactions} />
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
