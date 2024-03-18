import { Link, useFocusEffect } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { useCallback, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { fetchTransactionsByEthAddress } from '../api/firestoreService';
import Balance from '../components/Balance';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import BottomSheet, { BottomSheetRefProps } from '../components/modals/BottomSheet';
import PreviousTransactions from '../components/transactions/UI/PreviousTransactions';
import TransactionInformation from '../components/transactions/UI/TransactionInformation';
import { COLORS } from '../constants/global-styles';
import i18n from '../constants/i18n';
import { Transaction } from '../models/Transaction';
import { useAccount } from '../store/SmartAccountContext';
import { scale } from '../utils/scalingFunctions';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [transactionInfo, setTransactionInfo] = useState<Transaction>();
  const { address } = useAccount();
  const transactionDetailsRefs = useRef<BottomSheetRefProps>(null);
  const isActionTrayOpened = useSharedValue(false);

  const close = useCallback(() => {
    transactionDetailsRefs.current?.close();
    isActionTrayOpened.value = false;
  }, []);

  const toggleActionTray = useCallback(() => {
    const isActive = transactionDetailsRefs.current?.isActive() ?? false;
    isActionTrayOpened.value = !isActive;
    isActive ? close() : transactionDetailsRefs.current?.open();
  }, [close, isActionTrayOpened]);

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
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
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
              <PreviousTransactions
                transactions={transactions}
                toggleActionTray={toggleActionTray}
                setTransactionInfo={setTransactionInfo}
              />
            </Skeleton>
          </ScrollView>
          <View style={styles.bottomSheetContainer}>
            <BottomSheet ref={transactionDetailsRefs} colorMode="light">
              <TransactionInformation transaction={transactionInfo} />
            </BottomSheet>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
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
    backgroundColor: COLORS.dark,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: scale(48),
    paddingHorizontal: 12,
  },
  bottomSheetContainer: {
    position: 'absolute',
    width: '100%',
    left: -10,
    bottom: 0,
    zIndex: 9999,
  },
});
