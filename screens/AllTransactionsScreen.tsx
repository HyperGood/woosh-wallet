import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { fetchTransactions } from '../api/firestoreService';
import TransactionCard from '../components/transactions/UI/TransactionCard';
import { COLORS } from '../constants/global-styles';
import { Transaction } from '../models/Transaction';

const AllTransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Partial<Transaction>[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const transactions = await fetchTransactions();
        transactions?.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
          } else {
            return 0;
          }
        });
        console.log(transactions);
        setTransactions(transactions);
      })();
    }, [])
  );

  const groupedTransactions = transactions.reduce<Record<string, Transaction[]>>(
    (groups, transaction) => {
      if (transaction.createdAt && transaction.id) {
        const date = transaction.createdAt.toDate().toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(transaction as Transaction);
      }
      return groups;
    },
    {}
  );

  return (
    <View style={styles.wrapper}>
      <Link href="/(app)" asChild>
        <Text style={{ color: COLORS.light, marginTop: 100, marginLeft: 20 }}>Go home</Text>
      </Link>
      <FlatList
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
        data={Object.keys(groupedTransactions)}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => (
          <View style={styles.transactionsGroup}>
            <Text style={styles.date}>{date}</Text>
            <View style={styles.transactionsWrapper}>
              {groupedTransactions[date].map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  amount={Number(transaction.amount)}
                  user={transaction.recipientName || ''}
                  description={transaction.description}
                  date={transaction.createdAt.toDate().toDateString()}
                  sender={transaction.sender}
                />
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
};
export default AllTransactionsScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  container: {
    backgroundColor: COLORS.light,
    flex: 1,
    marginTop: 72,
    borderRadius: 36,
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    marginHorizontal: 10,
    marginBottom: 24,
    gap: 20,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Satoshi-Bold',
    lineHeight: 44,
  },
  filter: {
    fontSize: 16,
    fontFamily: 'Satoshi',
    textDecorationLine: 'underline',
    opacity: 0.6,
  },
  transactionsContainer: {
    flex: 1,
  },
  date: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    letterSpacing: -0.02,
    color: COLORS.gray[600],

    marginLeft: 10,
  },
  transactionsGroup: {
    gap: 8,
  },
  transactionsWrapper: {
    gap: 10,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
