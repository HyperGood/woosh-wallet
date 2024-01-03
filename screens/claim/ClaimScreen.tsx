import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingIndicator from '../../components/UI/LoadingIndicator';
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
  const [isLoading, setIsLoading] = useState(false);

  const fadeOutAnim = useSharedValue(1);
  const fadeInAnim = useSharedValue(0);

  const fadeOutAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeOutAnim.value,
    };
  });

  const fadeInAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInAnim.value,
    };
  });

  const claimFunction = async () => {
    fadeOutAnim.value = withTiming(0, { duration: 500 }); // Start fade out
    fadeInAnim.value = withDelay(500, withTiming(1, { duration: 200 })); // Start fade in

    setIsLoading(true);
    try {
      //Claim the transaction
      console.log('Claiming');
      console.log('Transaction data: ', transactionData);
      if (!address) {
        console.log('No address');
        setIsLoading(false);
        return;
      }
      if (!secret) {
        console.log('No secret');
        setIsLoading(false);
        return;
      }
      if (!transactionData.depositIndex) {
        console.log('No deposit index');
        setIsLoading(false);
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
      setIsLoading(false);
      // Handle error
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[{ width: '100%', marginTop: 64, gap: 16 }, fadeOutAnimatedStyle]}>
        <Pressable onPress={backFunction}>
          <Text style={{ color: COLORS.light }}>Go back</Text>
        </Pressable>
        <Text style={styles.title}>Claim Screen</Text>
        <Input placeholder="Enter the secret" value={secret} onChangeText={setSecret} />
      </Animated.View>
      {isLoading ? (
        <Animated.View
          style={[
            {
              flex: 1,
              width: '100%',
            },
            fadeInAnimatedStyle,
          ]}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {isLoading && <LoadingIndicator isLoading={isLoading} />}

            <Text style={{ color: COLORS.light, fontSize: 24, marginTop: 16 }}>
              Claiming funds...
            </Text>
          </View>
        </Animated.View>
      ) : (
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <Button title="Claim" type="primary" onPress={claimFunction} />
        </View>
      )}
    </SafeAreaView>
  );
};
export default ClaimScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
  },
});
