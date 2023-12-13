import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../../constants/global-styles';

interface TranscationCardProps {
  amount: number;
  user: string;
  userImage?: any;
  description?: string;
  date: string;
}
const TransactionCard: React.FC<TranscationCardProps> = ({
  amount,
  user,
  userImage,
  description,
  date,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.userContainer}>
          {userImage && <Image source={userImage} style={styles.userImage} />}
          <Text style={styles.user}>{user}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={[styles.amount, amount > 0 && styles.positive]}>
        {amount > 0 && '+'}${amount}
      </Text>
    </View>
  );
};
export default TransactionCard;
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  user: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[400],
  },
  description: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
  },
  date: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    opacity: 0.4,
    marginTop: 16,
  },
  positive: {
    color: COLORS.primary[600],
  },
});
