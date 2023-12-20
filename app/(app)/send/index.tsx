import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { encodeFunctionData, parseUnits, zeroAddress } from 'viem';

import { COLORS } from '../../../constants/global-styles';
import { depositVaultAbi } from '../../../references/depositVault-abi';
import EnterAmount from '../../../screens/send/EnterAmount';
import SelectContact from '../../../screens/send/SelectContact';
import SuccessScreen from '../../../screens/send/SuccessScreen';
import { useAccount } from '../../../store/smart-account-context';

const Page = () => {
  const { ecdsaProvider } = useAccount();
  const [screen, setScreen] = useState('selectContact');
  const [amount, setAmount] = useState('0');

  const handleNext = () => {
    if (screen === 'selectContact') {
      setScreen('enterAmount');
    }
  };

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
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {screen === 'selectContact' && <SelectContact onNext={handleNext} />}
        {screen === 'enterAmount' && <EnterAmount onAmountChange={setAmount} deposit={deposit} />}
        {/* <SuccessScreen /> */}
      </View>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 72,
  },
});
