import { useAtomValue } from 'jotai';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../../constants/global-styles';
import i18n from '../../../constants/i18n';
import { Transaction } from '../../../models/Transaction';
import { userAddressAtom } from '../../../store/store';

const HomeTransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const address = useAtomValue(userAddressAtom);

  const claimedTextStyles = transaction.claimed ? { opacity: 1 } : { opacity: 0.5 };

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(transaction.createdAt.toDate());

  return (
    <View style={styles.container}>
      <Text style={[styles.amount, transaction.senderAddress !== address && styles.positive]}>
        {transaction.senderAddress !== address ? '+' : '-'}$
        {Number(transaction.amount).toLocaleString('us', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 5,
        })}
      </Text>

      <Text style={styles.recipientName}>
        {transaction.senderAddress !== address
          ? `${i18n.t('from')}: ${transaction.sender}`
          : `${i18n.t('to')}: ${transaction.recipientName}`}
      </Text>
      <Text style={styles.description}>{transaction.description}</Text>
      <View>
        <Text style={styles.date}>{transaction.createdAt.toDate().toDateString()}</Text>
        <Text style={styles.date}>{formattedTime}</Text>
      </View>
      {transaction.senderAddress === address && transaction.type !== 'ethAddress' && (
        <Text style={[styles.claimedText, claimedTextStyles]}>
          {transaction.claimed ? i18n.t('claimed') : i18n.t('unclaimed')}
        </Text>
      )}
    </View>
  );
};
export default HomeTransactionCard;
const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray[400],
    paddingVertical: 20,
  },
  amount: {
    fontFamily: 'FHOscar',
    fontSize: 32,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    marginBottom: 16,
  },
  recipientName: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  recipientPhone: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  userImage: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: COLORS.gray[400],
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    marginBottom: 8,
  },
  date: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    opacity: 0.4,
    marginTop: 4,
  },
  positive: {
    color: COLORS.primary[600],
  },
  claimedText: {
    color: COLORS.gray[600],
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    letterSpacing: -0.02,
    marginTop: 16,
  },
});
