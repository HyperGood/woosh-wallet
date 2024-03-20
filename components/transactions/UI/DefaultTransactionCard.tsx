import { Skeleton } from 'moti/skeleton';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS, SkeletonCommonProps } from '../../../constants/global-styles';
import i18n from '../../../constants/i18n';
import { useSmartAccount } from '../../../store/SmartAccountContext';
import { scale } from '../../../utils/scalingFunctions';

interface TranscationCardProps {
  amount: number;
  recipientName?: string;
  profilePicture?: any;
  description?: string;
  date: string;
  claimed?: boolean;
  sender?: string;
}
const DefaultTransactionCard: React.FC<TranscationCardProps> = ({
  amount,
  recipientName,
  profilePicture,
  description,
  date,
  sender,
}) => {
  const { address } = useSmartAccount();

  return (
    <Skeleton height={200} width={200} {...SkeletonCommonProps}>
      <View style={styles.container}>
        <View style={{ alignItems: 'flex-start', gap: 4 }}>
          <View style={styles.tag}>
            <Text style={styles.date}>{date}</Text>
          </View>
          <Text style={[styles.amount, sender !== address && styles.positive]}>
            $
            {amount.toLocaleString('en-US', { maximumFractionDigits: 5, minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-start', gap: 4 }}>
          <View style={styles.tag}>
            <Text style={{ opacity: 0.6 }}>{recipientName ? i18n.t('to') : i18n.t('from')}</Text>
          </View>
          <View>
            {profilePicture && <Image source={profilePicture} style={styles.userImage} />}
            <Text style={styles.recipientName}>{recipientName ? recipientName : sender}</Text>
          </View>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
    </Skeleton>
  );
};
export default DefaultTransactionCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.light,
    paddingVertical: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: scale(275),
    aspectRatio: 3 / 4,
  },
  tag: {
    borderRadius: 100,
    backgroundColor: COLORS.gray[400],
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    opacity: 0.6,
  },
  positive: {
    color: COLORS.primary[600],
  },
});
