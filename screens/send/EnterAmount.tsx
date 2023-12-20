import * as LocalAuthentication from 'expo-local-authentication';
import { Image, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { encodeFunctionData, parseUnits, zeroAddress } from 'viem';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import NumberPad from '../../components/UI/NumberPad';
import { COLORS } from '../../constants/global-styles';
import { depositVaultAbi } from '../../references/depositVault-abi';
import { useAccount } from '../../store/smart-account-context';
import { useState } from 'react';

const EnterAmount = () => {
  const { ecdsaProvider } = useAccount();
  const [amount, setAmount] = useState('0');
  const deposit = async () => {
    console.log('Depositting');
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
      } else {
        Alert.alert('Authentication Failed!!');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Transaction Failed!!');
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
          <NumberPad onChange={setAmount} />
          <View style={styles.buttonWrapper}>
            <Button title="Send" type="primary" onPress={deposit} />
          </View>
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
