import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import {
  createPublicClient,
  encodeFunctionData,
  formatEther,
  http,
  parseUnits,
  zeroAddress,
} from 'viem';
import { optimismGoerli } from 'viem/chains';

import { storage } from '../../app/_layout';
import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import NumberPad from '../../components/UI/NumberPad';
import { COLORS } from '../../constants/global-styles';
import useAddress from '../../hooks/useAddress';
import { depositVaultAbi } from '../../references/depositVault-abi';
import { useAccount } from '../../store/smart-account-context';

const EnterAmount = () => {
  const [amount, setAmount] = useState('0');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const { address } = useAddress();
  const { ecdsaProvider, setFiatBalance, setTokenBalance } = useAccount();
  const ethMXPrice = storage.getNumber('ethMXPrice') || 0;
  const client = createPublicClient({
    chain: optimismGoerli,
    transport: http(`https://opt-goerli.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_ID}`),
  });

  const deposit = async () => {
    setIsSending(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (hasHardware) {
        const authResult = await LocalAuthentication.authenticateAsync();
        if (!authResult.success) {
          Alert.alert('Authentication Failed!!');
          return;
        }
        if (!ecdsaProvider) throw new Error('No ecdsaProvider');
        const { hash } = await ecdsaProvider.sendUserOperation({
          target: '0x835d70aa12353f3866b118F8c9b70685Db44ad4D',
          value: parseUnits(amount, 18),
          data: encodeFunctionData({
            abi: depositVaultAbi,
            functionName: 'deposit',
            args: [parseUnits('0', 18), zeroAddress],
          }),
        });
        console.log('User Op Hash: ', hash);
        Alert.alert('Transaction Successful!! User Op Hash: ', hash);
        setIsSending(false);
        //refetch balance
        if (address) {
          const balance = await client.getBalance({
            address,
          });
          const formattedBalance = Number(formatEther(balance));
          setTokenBalance(formattedBalance);
          setFiatBalance(formattedBalance * ethMXPrice);
          storage.set('tokenBalance', formattedBalance);
        } else {
          Alert.alert('Authentication Failed!!');
          setError("Authentication Failed!! Couldn't send transaction");
          setIsSending(false);
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Transaction Failed!!');
      setError("Couldn't send transaction");
      setIsSending(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, width: '100%' }}>
      <View style={styles.wrapper}>
        <BackButton />
        <View>
          <Text style={styles.title}>Sending To</Text>
          <View style={styles.recipient}>
            <Image style={styles.image} source={require('../../assets/images/temp/janet.jpg')} />
            <Text style={styles.recipientName}>Janet</Text>
          </View>
          {isSending && !error ? (
            <Text style={{ color: 'white' }}>Sending...</Text>
          ) : (
            <>
              <NumberPad onChange={setAmount} />
              <View style={styles.buttonWrapper}>
                <Button title="Send" type="primary" onPress={deposit} />
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default EnterAmount;
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
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  recipientName: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
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
