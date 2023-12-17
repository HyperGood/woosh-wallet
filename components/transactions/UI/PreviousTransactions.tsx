import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import TransactionCardHome from './TransactionCardHome';
import previousTransactions from './temp/previousTransactions';
import { COLORS } from '../../../constants/global-styles';

const PreviousTransactions = () => {
  const leftTransactions = [previousTransactions[0], previousTransactions[3]];
  const rightTransactions = [previousTransactions[1], previousTransactions[2]];
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
              <TransactionCardHome
                amount={transaction.amount}
                user={transaction.user}
                userImage={transaction.userImage}
                description={transaction.description}
                date={transaction.date}
              />
            </View>
          ))}
        </View>
        <View style={styles.cardsRight}>
          {rightTransactions.map((transaction, index) => (
            <View style={[index === 1 && styles.rotateRight]} key={transaction.id}>
              <TransactionCardHome
                amount={transaction.amount}
                user={transaction.user}
                userImage={transaction.userImage}
                description={transaction.description}
                date={transaction.date}
              />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>Ver Todas Mis Transacciones</Text>
        <Feather name="arrow-up-right" size={16} color={COLORS.dark} />
      </View>
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
