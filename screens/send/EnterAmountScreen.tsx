import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import NumberPad from '../../components/UI/NumberPad';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useDeposit } from '../../hooks/DepositVault/useDeposit';
import { useSignDeposit } from '../../hooks/DepositVault/useSignDeposit';
import { useSendUSDc } from '../../hooks/Transactions/useSendUSDc';
import { usePreventRemove } from '../../hooks/usePreventRemove';
import { useTransaction } from '../../store/TransactionContext';
import { truncateAddress } from '../../utils/ethereumUtils';

const EnterAmountScreen = () => {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');
  const { deposit, isDepositing, depositError, depositHash } = useDeposit();
  const [isSaving, setIsSaving] = useState(false);
  const { signDeposit } = useSignDeposit();
  const { transactionData, setTransactionData } = useTransaction();
  const { sendUSDc, transactionHash: sendHash, isSending, transactionError } = useSendUSDc();

  const navigation = useNavigation();

  usePreventRemove(isDepositing || isSaving || isSending, ({ data }) => {
    Alert.alert(
      'Cancel transaction?',
      'Youre transaction is still sending. Are you sure you want to cancel?',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => {} },
        {
          text: 'Cancel Transaction',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ]
    );
  });

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
        setIsSaving(false);
        router.replace('/(tabs)/(home)/send/success');
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
    <ScrollView style={{ flex: 1, width: '100%' }} centerContent>
      <View style={[styles.wrapper, { paddingTop: insets.top, position: 'relative' }]}>
        <View style={styles.recipient}>
          {(isDepositing || isSaving || isSending) && !depositError && !transactionError ? null : (
            <BackButton />
          )}
          <Text style={styles.recipientName}>
            {i18n.t('sendingTo')}{' '}
            {transactionData?.recipientName
              ? transactionData?.recipientName
              : truncateAddress(transactionData?.recipientInfo || '')}
          </Text>
          {transactionData?.recipientPhone && (
            <Text style={styles.recipientPhone}>{transactionData?.recipientPhone}</Text>
          )}
        </View>
        {(isDepositing || isSaving || isSending) && !depositError && !transactionError ? (
          <LoadingSpinner />
        ) : (
          <View style={{ flex: 1, width: '100%' }}>
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
          </View>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipient: {
    paddingHorizontal: 16,
    gap: 4,
    marginBottom: 8,
    width: '100%',
  },
  recipientName: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    textAlign: 'center',
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
