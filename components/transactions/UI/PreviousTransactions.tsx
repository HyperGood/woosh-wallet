import { Pressable, StyleSheet, Text, View } from 'react-native';

import TransactionCardHome from './HomeTransactionCard';
import { COLORS } from '../../../constants/global-styles';
import i18n from '../../../constants/i18n';
import { Transaction } from '../../../models/Transaction';

interface PreviousTransactionsProps {
  transactions: Transaction[] | undefined;
  toggleActionTray: () => void;
  setTransactionInfo: React.Dispatch<React.SetStateAction<Transaction | undefined>>;
}

const PreviousTransactions = ({
  transactions,
  toggleActionTray,
  setTransactionInfo,
}: PreviousTransactionsProps) => {
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
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{i18n.t('previousTransactionTitle1')}</Text>
        <Text style={styles.title}>{i18n.t('previousTransactionTitle2')}</Text>
      </View>
      <View style={styles.cards}>
        <View style={styles.cardsLeft}>
          {leftTransactions.map((transaction: Transaction, index: number) => (
            <Pressable
              onPress={() => (toggleActionTray(), setTransactionInfo(transaction))}
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
              onPress={() => (toggleActionTray(), setTransactionInfo(transaction))}
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
    </View>
  );
};
export default PreviousTransactions;
const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 16,
    padding: 40,
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
    paddingTop: 40,
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  titleWrapper: {
    marginHorizontal: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.dark,
  },
  cards: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cardsLeft: {
    gap: 32,
    width: '48%',
    marginTop: 20,
  },
  cardsRight: {
    gap: 32,
    width: '48%',
  },
  rotateLeft: {
    transform: [{ rotate: '-1.5deg' }],
  },
  rotateRight: {
    transform: [{ rotate: '1.5deg' }],
  },
});
