import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import TransactionCardHome from './HomeTransactionCard';
import TransactionInformation from './TransactionInformation';
import { COLORS } from '../../../constants/global-styles';
import i18n from '../../../constants/i18n';
import { Transaction } from '../../../models/Transaction';
import BottomSheet, { BottomSheetRefProps } from '../../modals/BottomSheet';
import { useCallback, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';

interface PreviousTransactionsProps {
  transactions: Transaction[] | undefined;
}

const PreviousTransactions = ({ transactions }: PreviousTransactionsProps) => {
  const leftTransactionDetailsRefs = Array.from({ length: 50 }, () => useRef<BottomSheetRefProps>(null));
  const rightTransactionDetailsRefs = Array.from({ length: 50 }, () => useRef<BottomSheetRefProps>(null));
  const isActionTrayOpened = useSharedValue(false);

  const close = useCallback(() => {
    leftTransactionDetailsRefs.forEach(ref => {
      if (ref.current) ref.current.close();
    });
    rightTransactionDetailsRefs.forEach((ref) => {
      if (ref.current) ref.current.close();
    });
    isActionTrayOpened.value = false;
  }, [leftTransactionDetailsRefs, rightTransactionDetailsRefs, isActionTrayOpened]);

  const toggleActionTray = useCallback((ref: React.RefObject<BottomSheetRefProps>) => {
    const isActive = ref.current?.isActive() ?? false;
    isActionTrayOpened.value = !isActive;
    isActive ? close() : ref.current?.open();
  }, [close, isActionTrayOpened]);

  if (!transactions || transactions.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>Your transactions will appear here</Text>
      </View>
    );
  }
  const slicedTransactions = transactions.slice(0, 4);
  const leftTransactions = slicedTransactions.filter((_: any, index: number) => index % 2 === 0);
  const rightTransactions = slicedTransactions.filter((_: any, index: number) => index % 2 !== 0);
  
  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <View style={styles.container}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{i18n.t('previousTransactionTitle1')}</Text>
            <Text style={styles.title}>{i18n.t('previousTransactionTitle2')}</Text>
          </View>
          <View style={styles.cards}>
            <View style={styles.cardsLeft}>
              {leftTransactions.map((transaction: Transaction, index: number) => (
                <Pressable
                  onPress={() => toggleActionTray(leftTransactionDetailsRefs[index])}
                  key={transaction.id}>
                  <View style={[index === 0 && styles.rotateLeft]} key={transaction.id}>
                    {transaction.id ? (
                      <TransactionCardHome
                        amount={transaction.amount || '0'}
                        recipientName={transaction.recipientName}
                        description={transaction.description}
                        date={transaction.createdAt?.toDate()}
                        claimed={Boolean(transaction.claimedAt)}
                        sender={transaction.senderAddress}
                        senderName={transaction.sender}
                      />
                    ) : (
                      <div>No transaction ID found</div>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
            <View style={styles.cardsRight}>
              {rightTransactions.map((transaction: Transaction, index: number) => (
                <Pressable
                  onPress={() => toggleActionTray(rightTransactionDetailsRefs[index])}
                  key={transaction.id}>
                  <View style={[index === 1 && styles.rotateRight]} key={transaction.id}>
                    <TransactionCardHome
                      amount={transaction.amount || '0'}
                      recipientName={transaction.recipientName}
                      description={transaction.description}
                      date={transaction.createdAt?.toDate()}
                      claimed={Boolean(transaction.claimedAt)}
                      sender={transaction.senderAddress}
                      senderName={transaction.sender}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
          <Link href="/(app)/transactions" asChild>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>{i18n.t('viewAllTransactions')}</Text>
              <Feather name="arrow-up-right" size={16} color={COLORS.dark} />
            </Pressable>
          </Link>
        </View>
        {leftTransactions.map((transaction: Transaction, index: number) => (
          <View style={styles.bottomSheetContainer} key={transaction.id}>
            <BottomSheet ref={leftTransactionDetailsRefs[index]} colorMode="light">
              <TransactionInformation transaction={transaction} close={close}/>
            </BottomSheet>
          </View>
        ))}
        {rightTransactions.map((transaction: Transaction, index: number) => (
          <View style={styles.bottomSheetContainer} key={transaction.id}>
            <BottomSheet ref={rightTransactionDetailsRefs[index]} colorMode="light">
              <TransactionInformation transaction={transaction} close={close}/>
            </BottomSheet>
          </View>
        ))}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default PreviousTransactions;
const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 16,
    paddingTop: 40,
  },
  emptyStateText: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.dark,
    textAlign: 'center',
  },

  container: {
    backgroundColor: COLORS.light,
    width: '100%',
    flex: 1,
    borderRadius: 36,
    paddingVertical: 40,
  },
  titleWrapper: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.dark,
  },
  cards: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 16,
  },
  cardsLeft: {
    gap: 32,
    width: '50%',
    marginTop: 16,
  },
  cardsRight: {
    gap: 32,
    width: '50%',
  },
  rotateLeft: {
    transform: [{ rotate: '-1deg' }],
  },
  rotateRight: {
    transform: [{ rotate: '1deg' }],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    opacity: 0.6,
    gap: 4,
  },
  viewAllText: {
    fontFamily: 'Satoshi',
    textDecorationLine: 'underline',
    fontSize: 16,
    color: COLORS.dark,
  },
  // Nuevos
  bottomSheetContainer: {
    position: 'absolute',
    width: "100%",
    left: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
