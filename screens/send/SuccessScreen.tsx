import firestore from '@react-native-firebase/firestore';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '../../components/UI/Button';
import DefaultTransactionCard from '../../components/transactions/UI/DefaultTransactionCard';
import { COLORS } from '../../constants/global-styles';
import { useAccount } from '../../store/SmartAccountContext';
import { useTransaction } from '../../store/TransactionContext';
import { useUserData } from '../../store/UserDataContext';
import i18n from '../../constants/i18n';

const SuccessScreen = () => {
  const { transactionData, signature } = useTransaction();
  const { address } = useAccount();
  const { userData } = useUserData();

  useEffect(() => {
    if (!transactionData) {
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
  }, []);

  if (!transactionData) {
    return null;
  }
  const { recipientName, description } = transactionData;
  const amount = Number(transactionData.amount);
  const date = new Date().toLocaleDateString();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(signature);
    Alert.alert('Copied to clipboard!');
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00FF47', '#19181D']}
        style={styles.background}
        end={{ x: 0.3, y: 0.7 }}
      />
      <Link href="/(app)">
        <Text style={styles.description}>{i18n.t('goHome')}</Text>
      </Link>
      <Text style={styles.title}>{i18n.t('sent')}! 🥳</Text>
      <Text style={styles.description}>{i18n.t('successDescription')} </Text>
      <DefaultTransactionCard
        amount={amount}
        recipientName={recipientName || ''}
        description={description}
        date={date}
      />
      <Pressable onPress={copyToClipboard}>
        <Text style={styles.description}>Secret: {signature}</Text>
      </Pressable>
      <View style={styles.buttonWrapper}>
        <Button title={i18n.t('share')} type="primary" icon="share" onPress={() => {}} />
      </View>
    </View>
  );
};
export default SuccessScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 16,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
});
