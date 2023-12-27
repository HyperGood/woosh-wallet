import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import TransactionCardHome from './TransactionCardHome';
import { COLORS } from '../../../constants/global-styles';

interface PreviousTransactionsProps {
  transactions: any;
}

const PreviousTransactions = ({ transactions }: PreviousTransactionsProps) => {
  if (!transactions || transactions.length === 0) {
    return <Text>No Transactions Found</Text>;
  }
  const leftTransactions =
    transactions[0] && transactions[2] ? [transactions[0], transactions[2]] : [transactions[0]];
  const rightTransactions =
    transactions[1] && transactions[3] ? [transactions[1], transactions[3]] : [transactions[1]];
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Mis</Text>
        <Text style={styles.title}>Transacciones</Text>
      </View>
      <View style={styles.cards}>
        <View style={styles.cardsLeft}>
          {leftTransactions.map((transaction, index) => (
            <View style={[index === 0 && styles.rotateLeft]} key={transaction.id}>
              {transaction.id ? (
                <Link href={`/claim/${transaction.id}`}>
                  <TransactionCardHome
                    amount={transaction.amount}
                    user={transaction.recipient}
                    userImage={transaction.userImage}
                    description={transaction.description}
                    date={transaction.createdAt.toDate().toDateString()}
                    claimed={transaction.claimed}
                  />
                </Link>
              ) : (
                <div>No transaction ID found</div>
              )}
            </View>
          ))}
        </View>
        <View style={styles.cardsRight}>
          {rightTransactions.map((transaction, index) => (
            <View style={[index === 1 && styles.rotateRight]} key={transaction.id}>
              <Link href={`/claim/${transaction.id}`}>
                <TransactionCardHome
                  amount={transaction.amount}
                  user={transaction.recipient}
                  userImage={transaction.userImage}
                  description={transaction.description}
                  date={transaction.createdAt.toDate().toDateString()}
                  claimed={transaction.claimed}
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
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cardsLeft: {
    gap: 32,
    width: '48%',
    marginTop: 8,
  },
  cardsRight: {
    gap: 32,
    width: '48%',
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
