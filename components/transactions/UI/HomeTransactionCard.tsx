import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS, SkeletonCommonProps } from '../../../constants/global-styles';
import { useAccount } from '../../../store/SmartAccountContext';

interface TranscationCardProps {
  amount: string;
  recipientName?: string;
  recipientImage?: any;
  description?: string;
  date: string;
  claimed?: boolean;
  sender?: string;
}
const HomeTransactionCard: React.FC<TranscationCardProps> = ({
  amount,
  recipientName,
  recipientImage,
  description,
  date,
  claimed,
  sender,
}) => {
  const { address } = useAccount();

  return (
    <Skeleton height={200} width={200} {...SkeletonCommonProps}>
      <View style={styles.container}>
        <Text style={[styles.amount, sender !== address && styles.positive]}>${amount}</Text>
        {recipientImage && <Image source={recipientImage} style={styles.userImage} />}
        <Text style={styles.recipientName}>{recipientName}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text> {claimed ? 'Claimed' : 'Not Claimed'}</Text>
      </View>
    </Skeleton>
  );
};
export default HomeTransactionCard;
const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray[200],
    paddingVertical: 20,
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
