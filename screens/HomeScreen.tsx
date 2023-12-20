import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { encodeFunctionData, parseEther, parseUnits, zeroAddress } from 'viem';

import Balance from '../components/Balance';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import PreviousTransactions from '../components/transactions/UI/PreviousTransactions';
import { COLORS } from '../constants/global-styles';
import { depositVaultAbi } from '../references/depositVault-abi';
import { useAccount } from '../store/smart-account-context';

const HomeScreen = () => {
  const { ecdsaProvider } = useAccount();

  const testDeposit = async () => {
    try {
      if (!ecdsaProvider) throw new Error('No ecdsaProvider');
      const { hash } = await ecdsaProvider.sendUserOperation({
        target: '0x835d70aa12353f3866b118F8c9b70685Db44ad4D',
        value: parseUnits('0.001', 18),
        data: encodeFunctionData({
          abi: depositVaultAbi,
          functionName: 'deposit',
          args: [parseUnits('0', 18), zeroAddress],
        }),
      });
      console.log('User Op Hash: ', hash);
      Alert.alert('Transaction Successful!! User Op Hash: ', hash);
    } catch (e) {
      console.log(e);
      Alert.alert('Transaction Failed!!');
    }
  };

  //Deploy Account
  const deployAccount = async () => {
    try {
      if (!ecdsaProvider) throw new Error('No ecdsaProvider');
      const { hash } = await ecdsaProvider.sendUserOperation({
        target: zeroAddress,
        value: parseEther('0'),
        data: '0x',
      });
      console.log('User Op Hash: ', hash);
      Alert.alert('Transaction Successful!! User Op Hash: ', hash);
    } catch (e) {
      console.log(e);
      Alert.alert('Transaction Failed!!');
    }
  };

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        <Header />
        <Balance />
        <View style={styles.buttonsContainer}>
          <Button
            title="Deploy Account"
            icon="arrow-down-left"
            type="secondary"
            swapIcon
            onPress={deployAccount}
          />
          <Button title="Enviar" icon="send" type="primary" onPress={testDeposit} />
        </View>
        <PreviousTransactions />
      </View>
    </ScrollView>
  );
};
export default HomeScreen;
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
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 80,
    paddingHorizontal: 12,
  },
});
