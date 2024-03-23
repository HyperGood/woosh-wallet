import { useAtomValue } from 'jotai';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../../constants/global-styles';
import { userAddressAtom } from '../../../store/store';

interface TranscationCardProps {
  amount: number;
  user: string;
  userImage?: any;
  description?: string;
  date: Date;
  sender?: string;
}
const TransactionCard: React.FC<TranscationCardProps> = ({
  amount,
  user,
  userImage,
  description,
  sender,
  date,
}) => {
  const address = useAtomValue(userAddressAtom);

  console.log(date.toLocaleDateString());
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
  console.log(formattedTime);
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.userContainer}>
          {userImage && <Image source={userImage} style={styles.userImage} />}
          <Text style={styles.user}>
            {sender !== address ? 'From' : 'To'}: {user}
          </Text>
        </View>
        {description && <Text style={styles.description}>Note: {description}</Text>}
        <Text style={styles.time}>{formattedTime}</Text>
      </View>

      <Text style={[styles.amount, sender !== address && styles.positive]}>
        {sender === address ? '-' : '+'}$
        {Number(amount).toLocaleString('us', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 5,
        })}
      </Text>
    </View>
  );
};
export default TransactionCard;
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray[400],
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
    fontSize: 18,
    letterSpacing: -0.02,
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
    fontSize: 14,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
  },

  positive: {
    color: COLORS.primary[600],
  },
  time: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    opacity: 0.4,
    marginTop: 8,
  },
});
