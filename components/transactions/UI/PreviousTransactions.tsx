import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/global-styles';
import TransactionCardHome from './TransactionCardHome';
import { Feather } from '@expo/vector-icons';

import lilly from './temp/lilly.jpg';
import marie from './temp/marie.jpg';
import kevin from './temp/kevin.jpg';

const PreviousTransactions = () => {
  const previousTransactions = [
    {
      amount: 500,
      user: 'Marie',
      userImage: marie,
      description: 'Feliz Cumpleaños',
      date: '2023-12-12',
    },
    {
      amount: -50,
      user: '311-103-2131',
      description: 'Indrive',
      date: '2023-12-11',
    },
    {
      amount: -100,
      user: 'Kevin',
      userImage: kevin,
      description: 'Feliz Cumpleaños',
      date: '2023-12-10',
    },
    {
      amount: -250,
      user: 'Lilly',
      userImage: lilly,
      description: 'Prestamo',
      date: '2023-12-09',
    },
  ];

  const leftTransactions = [previousTransactions[0], previousTransactions[3]];
  const rightTransactions = [previousTransactions[1], previousTransactions[2]];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previous Transactions</Text>
      <View style={styles.cards}>
        <View style={styles.cardsLeft}>
          {leftTransactions.map((transaction, index) => (
            <View style={[index === 0 && styles.rotateLeft]} key={index}>
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
            <View style={[index === 1 && styles.rotateRight]}>
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
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingVertical: 40,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.dark,
    marginHorizontal: 20,
    marginBottom: 32,
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
