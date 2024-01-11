import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import NumberPad from '../../components/UI/NumberPad';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useDeposit } from '../../hooks/DepositVault/useDeposit';
import { useSignDeposit } from '../../hooks/DepositVault/useSignDeposit';
import { useUserBalance } from '../../hooks/useUserBalance';
import { useTransaction } from '../../store/TransactionContext';

const EnterAmountScreen = () => {
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');
  const { deposit, isDepositing, depositError, depositHash } = useDeposit();
  const [isSaving, setIsSaving] = useState(false);
  const { signDeposit } = useSignDeposit();
  const { refetchBalance } = useUserBalance();
  const { transactionData, setTransactionData } = useTransaction();

  useEffect(() => {
    (async () => {
      if (depositHash && transactionData) {
        setIsSaving(true);
        refetchBalance();
        const updatedTransactionData = await signDeposit();
        if (typeof updatedTransactionData === 'object' && updatedTransactionData !== null) {
          setTransactionData({ ...updatedTransactionData, transactionHash: depositHash });
        } else {
          console.log('Updated transaction is not an object: ', updatedTransactionData);
        }
        router.push('/(app)/send/success');
      }
    })();
  }, [depositHash]);

  useEffect(() => {
    setTransactionData(
      transactionData
        ? { ...transactionData, amount, description }
        : { recipientName: '', token: 'USDc', amount, description }
    );
  }, [amount]);

  return (
    <ScrollView style={{ flex: 1, width: '100%' }}>
      <View style={styles.wrapper}>
        <BackButton />
        <View>
          <Text style={styles.title}>{i18n.t('sendingTo')}</Text>
          <View style={styles.recipient}>
            {/* <Image style={styles.image} source={require('../../assets/images/temp/janet.jpg')} /> */}
            <Text style={styles.recipientName}>{transactionData?.recipientName}</Text>
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
                  type="primary"
                  onPress={() => {
                    deposit(amount);
                    setDescription('');
                  }}
                  disabled={amount === '0'}
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
  title: {
    color: COLORS.light,
    marginHorizontal: 16,
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'capitalize',
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
