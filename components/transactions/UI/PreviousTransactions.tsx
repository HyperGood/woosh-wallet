import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import TransactionCardHome from './HomeTransactionCard';
import { COLORS } from '../../../constants/global-styles';
import { Transaction } from '../../../models/Transaction';

interface PreviousTransactionsProps {
  transactions: any;
}

const PreviousTransactions = ({ transactions }: PreviousTransactionsProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>Your transactions will appear here</Text>
      </View>
    );
  }
  const leftTransactions = transactions.filter((_: any, index: number) => index % 2 === 0);
  const rightTransactions = transactions.filter((_: any, index: number) => index % 2 !== 0);
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Mis</Text>
        <Text style={styles.title}>Transacciones</Text>
      </View>

      <View style={styles.cards}>
        <View style={styles.cardsLeft}>
          {leftTransactions.map((transaction: Partial<Transaction>, index: number) => (
            <View style={[index === 0 && styles.rotateLeft]} key={transaction.id}>
              {transaction.id ? (
                <Link href={`/claim/${transaction.id}`}>
                  <TransactionCardHome
                    amount={transaction.amount || '0'}
                    recipientName={transaction.recipientName}
                    description={transaction.description}
                    date={transaction.createdAt.toDate().toDateString()}
                    claimed={Boolean(transaction.claimedAt)}
                    sender={transaction.sender}
                  />
                </Link>
              ) : (
                <div>No transaction ID found</div>
              )}
            </View>
          ))}
        </View>
        <View style={styles.cardsRight}>
          {rightTransactions.map((transaction: Partial<Transaction>, index: number) => (
            <View style={[index === 1 && styles.rotateRight]} key={transaction.id}>
              <Link href={`/claim/${transaction.id}`}>
                <TransactionCardHome
                  amount={transaction.amount || '0'}
                  recipientName={transaction.recipientName}
                  description={transaction.description}
                  date={transaction.createdAt.toDate().toDateString()}
                  claimed={transaction.claimed}
                  sender={transaction.sender}
                />
              </Link>
            </View>
          ))}
        </View>
      </View>

      <Link href="/(app)/transactions" asChild>
        <Pressable style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Ver Todas Mis Transacciones</Text>
          <Feather name="arrow-up-right" size={16} color={COLORS.dark} />
        </Pressable>
      </Link>
    </View>
  );
};
export default PreviousTransactions;
const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 16,
    padding: 40,
  },
  emptyStateText: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.dark,
    textAlign: 'center',
    opacity: 0.6,
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
});
