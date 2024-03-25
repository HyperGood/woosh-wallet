import firestore from '@react-native-firebase/firestore';
import * as Sentry from '@sentry/react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { SafeAreaView, Share, StyleSheet, Text, View } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import DefaultTransactionCard from '../../components/transactions/UI/DefaultTransactionCard';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useTransaction } from '../../store/TransactionContext';
import { useUserData } from '../../store/UserDataContext';
import { userAddressAtom } from '../../store/store';

const SuccessScreen = () => {
  const { transactionData, signature } = useTransaction();
  const address = useAtomValue(userAddressAtom);
  const { userData } = useUserData();

  const onShare = async () => {
    try {
      await Share.share({
        message: `${i18n.t('shareMessageGreeting')} ${transactionData?.recipientName}! ${i18n.t(
          'shareMessageText1'
        )}${transactionData?.amount} ${i18n.t(
          'shareMessageText2'
        )} https://wooshapp.com/id+${signature}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    if (!transactionData || (transactionData.type === 'depositVault' && !signature)) {
      console.log('No transaction data found');
      return;
    }
    console.log('Sending transaction to firestore...');
    firestore()
      .collection('transactions')
      .add({
        ...transactionData,
        sender: userData.name || address,
        senderAddress: address,
        createdAt: new Date(),
        signature,
      })
      .then(() => {
        console.log('Transaction added!');
      });
  }, [signature]);

  if (!transactionData) {
    return null;
  }
  const { recipientName, description } = transactionData;
  const amount = Number(transactionData.amount);
  const date = new Date().toLocaleDateString();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00FF47', '#19181D']}
        style={styles.background}
        end={{ x: 0.3, y: 0.7 }}
      />
      <SafeAreaView style={styles.container}>
        <View />
        <View style={{ alignSelf: 'flex-start', position: 'absolute', top: 100 }}>
          <BackButton backFunction={() => router.push('/')} size={24} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>{i18n.t('sent')}! 🥳</Text>
          <Text style={styles.description}>{i18n.t('sendSuccessDescription')} </Text>
          <DefaultTransactionCard
            amount={amount}
            recipientName={recipientName || ''}
            description={description}
            date={date}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title={i18n.t('share')} type="secondary" icon="share" onPress={onShare} />
        </View>
      </SafeAreaView>
    </View>
  );
};
export default SuccessScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 48,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginBottom: 4,
  },
  description: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginBottom: 40,
  },
  backButton: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginBottom: 16,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
});
