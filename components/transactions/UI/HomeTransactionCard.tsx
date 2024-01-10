import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS, SkeletonCommonProps } from '../../../constants/global-styles';
import { useAccount } from '../../../store/SmartAccountContext';
import i18n from '../../../constants/i18n';

interface TranscationCardProps {
  amount: string;
  recipientName?: string;
  senderName?: string;
  recipientImage?: any;
  description?: string;
  date: Date;
  claimed?: boolean;
  sender?: string;
}
const HomeTransactionCard: React.FC<TranscationCardProps> = ({
  amount,
  recipientName,
  senderName,
  recipientImage,
  description,
  date,
  claimed,
  sender,
}) => {
  const { address } = useAccount();

  const claimedTextStyles = claimed ? { opacity: 1 } : { opacity: 0.5 };

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);

  return (
    <Skeleton height={200} width={200} {...SkeletonCommonProps}>
      <View style={styles.container}>
        <Text style={[styles.amount, sender !== address && styles.positive]}>
          {sender !== address ? '+' : '-'}$
          {Number(amount).toLocaleString('us', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 5,
          })}
        </Text>
        {recipientImage && <Image source={recipientImage} style={styles.userImage} />}
        <Text style={styles.recipientName}>
          {sender !== address
            ? `${i18n.t('from')}: ${senderName}`
            : `${i18n.t('to')}: ${recipientName}`}
        </Text>
        <Text style={styles.description}>{description}</Text>
        <View>
          <Text style={styles.date}>{date.toDateString()}</Text>
          <Text style={styles.date}>{formattedTime}</Text>
        </View>
        {sender === address && (
          <Text style={[styles.claimedText, claimedTextStyles]}>
            {claimed ? i18n.t('claimed') : i18n.t('unclaimed')}
          </Text>
        )}
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
    width: '100%',
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
