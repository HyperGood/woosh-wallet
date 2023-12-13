import { Feather } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import TransactionCard from '../components/transactions/UI/TransactionCard';
import previousTransactions from '../components/transactions/UI/temp/previousTransactions';
import { COLORS } from '../constants/global-styles';

const AllTransactionsScreen = () => {
  //Group transactions by date
  const transactionsByDate = previousTransactions.reduce<{
    [date: string]: typeof previousTransactions;
  }>((acc, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(transactionsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.backButton}>
                <Feather name="corner-down-left" color={COLORS.dark} size={16} />
                <Text>Regresar</Text>
              </View>
              <Text style={styles.title}>Todas Mis Transacciones</Text>
              <Text style={styles.filter}>Este Mes</Text>
            </View>
          </>
        }
        data={sortedDates}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => (
          <View style={styles.transactionsGroup}>
            <Text style={styles.date}>{date}</Text>
            <View style={styles.transactionsWrapper}>
              {transactionsByDate[date].map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  amount={transaction.amount}
                  user={transaction.user}
                  userImage={transaction.userImage}
                  description={transaction.description}
                  date={transaction.date}
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
