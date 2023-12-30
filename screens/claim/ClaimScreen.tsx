import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Pressable, View } from 'react-native';

import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { COLORS } from '../../constants/global-styles';
import { useWithdraw } from '../../hooks/DepositVault/useWithdraw';
import { useAccount } from '../../store/SmartAccountContext';

interface ClaimScreenProps {
  backFunction: () => void;
  transactionData: any;
  id: string;
}

const ClaimScreen = ({ backFunction, transactionData, id }: ClaimScreenProps) => {
  const [secret, setSecret] = useState('');
  const { withdraw, withdrawHash } = useWithdraw();
  const { address } = useAccount();
  const claimFunction = async () => {
    try {
      //Claim the transaction
      console.log('Claiming');
      console.log('Transaction data: ', transactionData);
      if (!address) {
        console.log('No address');
        return;
      }
      if (!secret) {
        console.log('No secret');
        return;
      }
      if (!transactionData.depositIndex) {
        console.log('No deposit index');
        return;
      }
      console.log('Executing withdraw');
      //400 error thrown here but everything works
      await withdraw(transactionData.depositIndex, secret as `0x${string}`, address);
      console.log('Withdraw executed! Updating database');
      firestore()
        .collection('transactions')
        //transaction data doesn't have the id.
        .doc(id)
        .update({
          claimedBy: address,
          claimedAt: new Date(),
          withdrawHash,
        })
        .then(() => {
          console.log('Transaction updated!');
          router.push('/');
        });
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={backFunction}>
        <Text style={{ color: COLORS.light }}>Go home</Text>
      </Pressable>
      <Text style={styles.title}>Claim Screen</Text>
      <Input placeholder="Enter the secret" value={secret} onChangeText={setSecret} />
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <Button title="Claim" type="primary" onPress={claimFunction} />
      </View>
    </SafeAreaView>
  );
};
export default ClaimScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
    marginHorizontal: 32,
    marginBottom: 16,
  },
});
