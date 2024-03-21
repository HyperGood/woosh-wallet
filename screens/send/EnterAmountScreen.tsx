import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '../../components/UI/Button';
import NumberPad from '../../components/UI/NumberPad';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useDeposit } from '../../hooks/DepositVault/useDeposit';
import { useSignDeposit } from '../../hooks/DepositVault/useSignDeposit';
import { useTransaction } from '../../store/TransactionContext';
import { useSendUSDc } from '../../hooks/Transactions/useSendUSDc';

const EnterAmountScreen = () => {
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');
  const { deposit, isDepositing, depositError, depositHash } = useDeposit();
  const [isSaving, setIsSaving] = useState(false);
  const { signDeposit } = useSignDeposit();
  const { transactionData, setTransactionData } = useTransaction();
  const { sendUSDc, transactionHash: sendHash } = useSendUSDc();

  useEffect(() => {
    (async () => {
      if ((depositHash || sendHash) && transactionData) {
        setIsSaving(true);
        console.log('Saving');
        if (depositHash) {
          console.log('Signing deposit');
          const updatedTransactionData = await signDeposit();
          if (typeof updatedTransactionData === 'object' && updatedTransactionData !== null) {
            console.log('Deposit signed');
            setTransactionData({
              ...updatedTransactionData,
              transactionHash: depositHash,
              type: transactionData?.type,
              description,
            });
          }
        } else if (sendHash) {
          setTransactionData({ ...transactionData, transactionHash: sendHash, description });
        }
        router.push('/(tabs)/(home)/send/success');
      }
    })();
  }, [depositHash, sendHash]);

  useEffect(() => {
    setTransactionData(
      transactionData
        ? { ...transactionData, amount, description }
        : {
            recipientName: '',
            token: 'USDc',
            amount,
            description,
            type: 'depositVault',
            recipientInfo: '',
          }
    );
  }, [amount]);

  function handleSendPress() {
    if (transactionData?.type === 'depositVault') {
      console.log('Depositing');
      deposit(amount);
    } else if (transactionData?.type === 'ethAddress') {
      console.log('Sending');
      sendUSDc(amount, transactionData.recipientInfo as `0x${string}`);
    }
  }

  return (
    <ScrollView style={{ flex: 1, width: '100%' }}>
      <View style={styles.wrapper}>
        <View>
          <View style={styles.recipient}>
            <Text style={styles.recipientName}>
              {i18n.t('sendingTo')} {transactionData?.recipientName}
            </Text>
            <Text style={styles.recipientPhone}>{transactionData?.recipientPhone}</Text>
          </View>
          {(isDepositing || isSaving) && !depositError ? (
            <LottieView
              source={require('../../assets/animations/loading.json')}
              autoPlay
              loop
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <>
              <NumberPad
                onChange={setAmount}
                description={description}
                setDescription={setDescription}
              />
              <View style={styles.buttonWrapper}>
                <Button
                  title={i18n.t('send')}
                  type="secondary"
                  onPress={handleSendPress}
                  disabled={parseFloat(amount) <= 0}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default EnterAmountScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  recipient: {
    marginHorizontal: 16,
    gap: 4,
    marginBottom: 8,
  },
  recipientName: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
  },
  recipientPhone: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    opacity: 0.6,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  buttonWrapper: {
    marginTop: 24,
    flexDirection: 'row',
    marginHorizontal: 12,
  },
});
