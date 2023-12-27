import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import NumberPad from '../../components/UI/NumberPad';
import { COLORS } from '../../constants/global-styles';
import { useDeposit } from '../../hooks/DepositVault/useDeposit';
import { useSignDeposit } from '../../hooks/DepositVault/useSignDeposit';
import { useUserBalance } from '../../hooks/useUserBalance';
import { useTransaction } from '../../store/TransactionContext';

const EnterAmountScreen = () => {
  const [amount, setAmount] = useState('0');
  const { deposit, isDepositing, depositError, depositHash } = useDeposit();
  const { signDeposit } = useSignDeposit();
  const { refetchBalance } = useUserBalance();
  const { transactionData, setTransactionData } = useTransaction();

  useEffect(() => {
    (async () => {
      if (depositHash && transactionData) {
        refetchBalance();
        await signDeposit();
        setTransactionData({ ...transactionData, transactionHash: depositHash });
        router.push('/(app)/send/success');
      }
    })();
  }, [depositHash]);

  useEffect(() => {
    setTransactionData(
      transactionData ? { ...transactionData, amount } : { recipientName: '', token: 'ETH', amount }
    );
  }, [amount]);

  return (
    <ScrollView style={{ flex: 1, width: '100%' }}>
      <View style={styles.wrapper}>
        <BackButton />
        <View>
          <Text style={styles.title}>Sending To</Text>
          <View style={styles.recipient}>
            {/* <Image style={styles.image} source={require('../../assets/images/temp/janet.jpg')} /> */}
            <Text style={styles.recipientName}>{transactionData?.recipientName}</Text>
            <Text style={styles.recipientPhone}>{transactionData?.recipientPhone}</Text>
          </View>
          {isDepositing && !depositError ? (
            <Text style={{ color: 'white' }}>Sending...</Text>
          ) : (
            <>
              <NumberPad onChange={setAmount} />
              <View style={styles.buttonWrapper}>
                <Button title="Send" type="primary" onPress={() => deposit(amount)} />
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
  title: {
    color: COLORS.light,
    marginHorizontal: 16,
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  recipient: {
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  recipientName: {
    fontSize: 32,
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
