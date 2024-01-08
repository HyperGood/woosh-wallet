import { Skeleton } from 'moti/skeleton';
import { Text, SafeAreaView, View, StyleSheet } from 'react-native';

import Button from '../../components/UI/Button';
import DefaultTransactionCard from '../../components/transactions/UI/DefaultTransactionCard';
import { COLORS, SkeletonCommonProps } from '../../constants/global-styles';

interface WelcomeScreenProps {
  transactionData: any;
  nextScreenFunction: () => void;
  loadingTransactionData: boolean;
}

const WelcomeScreen = ({
  transactionData,
  nextScreenFunction,
  loadingTransactionData,
}: WelcomeScreenProps) => {
  return (
    <Skeleton.Group show={loadingTransactionData}>
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <Skeleton {...SkeletonCommonProps}>
            <Text style={styles.title}>Claim your funds! 🥳</Text>
          </Skeleton>
          <Skeleton {...SkeletonCommonProps}>
            <Text style={[styles.description, { fontFamily: 'Satoshi-Bold' }]}>
              It only takes 30 seconds!
            </Text>
          </Skeleton>
          <Skeleton {...SkeletonCommonProps}>
            <Text style={styles.description}>
              With Woosh you can send money instantly. Split bills with friends effortlessly, even
              if they're not on Woosh.
            </Text>
          </Skeleton>
        </View>
        <View style={{ transform: [{ rotate: '1deg' }] }}>
          <Skeleton {...SkeletonCommonProps}>
            {transactionData && (
              <DefaultTransactionCard
                amount={transactionData.amount}
                sender={transactionData.sender}
                description={transactionData.description}
                date={transactionData.createdAt.toDate().toDateString()}
              />
            )}
          </Skeleton>
        </View>
        {!loadingTransactionData && (
          <View style={{ flexDirection: 'row', paddingBottom: 32, paddingHorizontal: 16 }}>
            <Button title="Get Started" onPress={nextScreenFunction} type="primary" />
          </View>
        )}
      </SafeAreaView>
    </Skeleton.Group>
  );
};
export default WelcomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  description: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Satoshi',
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
    maxWidth: 300,
  },
  textContainer: {
    marginHorizontal: 16,
    marginTop: 32,
    gap: 4,
  },
});
