import { LocalAccountSigner } from '@alchemy/aa-core';
import firestore from '@react-native-firebase/firestore';
import { ECDSAProvider } from '@zerodev/sdk';
import { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View } from 'react-native';

import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { COLORS } from '../../constants/global-styles';
import { useSession } from '../../store/AuthContext';
import { useAccount } from '../../store/SmartAccountContext';

interface OnboardingScreenProps {
  nextScreenFunction: () => void;
}

const OnboardingScreen = ({ nextScreenFunction }: OnboardingScreenProps) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const { authenticate } = useSession();
  const { setEcdsaProvider } = useAccount();

  const onButtonClick = async () => {
    try {
      //Generate new private key
      const token = await authenticate();
      console.log('Authenticated');
      //Wait for token to be set
      if (!token) {
        console.log('No token');
        return;
      }
      const ecdsaProvider = await ECDSAProvider.init({
        projectId: process.env.EXPO_PUBLIC_ZERODEV_ID || '',
        owner: LocalAccountSigner.privateKeyToAccountSigner(token as `0x${string}`),
      });
      setEcdsaProvider(ecdsaProvider);
      const address = await ecdsaProvider.getAddress();
      console.log('Zerodev Provider set');
      console.log('Address: ', address);
      //Wait for address to be set
      //Save user data to Firestore
      firestore().collection('users').add({
        name,
        username,
        ethAddress: address,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('Database set');
      //Go to claim screen
      nextScreenFunction();
    } catch (error) {
      console.error('Error in onboarding screen', error);
      // Handle error
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <Input placeholder="Enter your name" onChangeText={setName} value={name} />
      <Input placeholder="Enter your username" onChangeText={setUsername} value={username} />
      <View style={{ flexDirection: 'row' }}>
        <Button title="Next" onPress={onButtonClick} type="primary" />
      </View>
    </SafeAreaView>
  );
};
export default OnboardingScreen;
const styles = StyleSheet.create({
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
