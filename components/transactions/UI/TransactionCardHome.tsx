import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS, SkeletonCommonProps } from '../../../constants/global-styles';
import { useAccount } from '../../../store/SmartAccountContext';
import { Skeleton } from 'moti/skeleton';
import Animated, {
  FadeIn,
  BounceIn,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
interface TranscationCardProps {
  amount: number;
  recipientName?: string;
  recipientPhone: string;
  userImage?: any;
  description?: string;
  date: string;
  claimed?: boolean;
  sender?: string;
  index?: number;
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
  index = 0,
}) => {
  const { address } = useAccount();

  const entering = (targetValues: any) => {
    'worklet';
    const animations = {
      originX: withTiming(targetValues.originX, { duration: 3000 }),
      transform: [
        {
          scale: withDelay(index * 400, withSpring(1, { mass: 1.1, damping: 11, stiffness: 100 })),
        },
      ],
    };
    const initialValues = {
      originX: -200,
      transform: [{ scale: 0 }],
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <Skeleton height={200} width={200} {...SkeletonCommonProps}>
      <Animated.View style={styles.container} entering={entering}>
        <Text style={[styles.amount, sender !== address && styles.positive]}>${amount}</Text>
        {userImage && <Image source={userImage} style={styles.userImage} />}
        <Text style={styles.recipientName}>{recipientName}</Text>
        <Text style={styles.recipientPhone}>{recipientPhone}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text> {claimed ? 'Claimed' : 'Not Claimed'}</Text>
      </Animated.View>
    </Skeleton>
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
