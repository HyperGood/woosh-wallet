import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/global-styles';
interface TranscationCardProps {
  amount: number;
  user: string;
  userImage?: any;
  description?: string;
  date: string;
}
const TransactionCardHome: React.FC<TranscationCardProps> = ({
  amount,
  user,
  userImage,
  description,
  date,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.amount, amount > 0 && styles.positive]}>${amount}</Text>
      {userImage && <Image source={userImage} style={styles.userImage} />}
      <Text style={styles.user}>{user}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};
export default TransactionCardHome;
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  amount: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 32,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    marginBottom: 16,
  },
  user: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
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
