import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Balance from '../components/Balance';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import PreviousTransactions from '../components/transactions/UI/PreviousTransactions';
import { COLORS } from '../constants/global-styles';
import { useAccount } from '../store/smart-account-context';
import { encodeFunctionData, parseUnits, zeroAddress } from 'viem';
import { depositVaultAbi } from '../references/depositVault-abi';

const HomeScreen = () => {
  const [address, setAddress] = useState('');

  const { ecdsaProvider } = useAccount();

  const handleButton = () => {
    try {
      console.log('Getting address');
      if (!ecdsaProvider) throw new Error('No ecdsaProvider');
      ecdsaProvider?.getAddress().then((address) => {
        console.log('Address: ', address);
        setAddress(address);
      });
    } catch (e) {
      console.log(e);
    }
  };

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
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        <Header />
        <Text style={{ color: 'white' }}>{address}</Text>
        <Balance />
        <View style={styles.buttonsContainer}>
          <Button
            title="Cobrar"
            icon="arrow-down-left"
            type="secondary"
            swapIcon
            onPress={handleButton}
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
