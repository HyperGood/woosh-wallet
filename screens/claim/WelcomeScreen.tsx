import { router } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { Text, SafeAreaView, View, StyleSheet } from 'react-native';

import Button from '../../components/UI/Button';
import DefaultTransactionCard from '../../components/transactions/UI/DefaultTransactionCard';
import { COLORS, SkeletonCommonProps } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useSession } from '../../store/AuthContext';

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
  const { authenticate } = useSession();
  console.log('transactionData', transactionData);
  const onButtonClick = async () => {
    if (transactionData.claimedBy) {
      await authenticate();
      router.push('/');
    } else {
      nextScreenFunction();
    }
  };

  return (
    <Skeleton.Group show={loadingTransactionData}>
      <SafeAreaView style={styles.container}>
        {transactionData?.claimedBy ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 }}>
            <Text style={styles.title}>{i18n.t('welcomeClaimedTitle')}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title={i18n.t('loginButton')} onPress={onButtonClick} type="primary" />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button title={i18n.t('noAccountButton')} onPress={onButtonClick} />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.textContainer}>
              <Skeleton {...SkeletonCommonProps}>
                <Text style={styles.title}>{i18n.t('welcomeScreenTitle')} 🥳</Text>
              </Skeleton>
              <Skeleton {...SkeletonCommonProps}>
                <Text style={[styles.description, { fontFamily: 'Satoshi-Bold' }]}>
                  {i18n.t('welcomeScreenSubtitle')}
                </Text>
              </Skeleton>
              <Skeleton {...SkeletonCommonProps}>
                <Text style={styles.description}>{i18n.t('welcomeScreenDescription')}</Text>
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
          </>
        )}
        {!loadingTransactionData && !transactionData?.claimedBy && (
          <View style={{ flexDirection: 'row', paddingBottom: 32, paddingHorizontal: 16 }}>
            <Button title={i18n.t('getStarted')} onPress={nextScreenFunction} type="primary" />
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
    textTransform: 'capitalize',
  },
  textContainer: {
    marginHorizontal: 16,
    marginTop: 32,
    gap: 4,
  },
});
