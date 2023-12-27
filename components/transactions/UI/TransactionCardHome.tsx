import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../../constants/global-styles';
import { useAccount } from '../../../store/SmartAccountContext';
interface TranscationCardProps {
  amount: number;
  recipientName?: string;
  recipientPhone: string;
  userImage?: any;
  description?: string;
  date: string;
  claimed?: boolean;
  sender?: string;
}
const TransactionCardHome: React.FC<TranscationCardProps> = ({
  amount,
  recipientName,
  recipientPhone,
  userImage,
  description,
  date,
  claimed,
  sender,
}) => {
  const { address } = useAccount();
  return (
    <View style={styles.container}>
      <Text style={[styles.amount, sender !== address && styles.positive]}>${amount}</Text>
      {userImage && <Image source={userImage} style={styles.userImage} />}
      <Text style={styles.recipientName}>{recipientName}</Text>
      <Text style={styles.recipientPhone}>{recipientPhone}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text> {claimed ? 'Claimed' : 'Not Claimed'}</Text>
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
