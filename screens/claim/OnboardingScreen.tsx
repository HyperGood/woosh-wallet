import { LocalAccountSigner } from '@alchemy/aa-core';
import firestore from '@react-native-firebase/firestore';
import { ECDSAProvider } from '@zerodev/sdk';
import { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View } from 'react-native';
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
import { useSession } from '../../store/AuthContext';
import { useAccount } from '../../store/SmartAccountContext';

interface OnboardingScreenProps {
  nextScreenFunction: () => void;
  dbName?: string;
}

const OnboardingScreen = ({ nextScreenFunction, dbName }: OnboardingScreenProps) => {
  const [name, setName] = useState(dbName || '');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useSession();
  const { setEcdsaProvider } = useAccount();

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

  const onButtonClick = async () => {
    fadeOutAnim.value = withTiming(0, { duration: 500 }); // Start fade out
    fadeInAnim.value = withDelay(500, withTiming(1, { duration: 200 })); // Start fade in

    setIsLoading(true);
    try {
      //Generate new private key
      const token = await authenticate();
      console.log('Authenticated');
      //Wait for token to be set
      if (!token) {
        console.log('No token');
        setIsLoading(false);
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
      setIsLoading(false);
      // Handle error
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[{ width: '100%', marginTop: 64, gap: 16 }, fadeOutAnimatedStyle]}>
        <Text style={styles.title}>Onboarding</Text>
        <Input placeholder="Enter your name" onChangeText={setName} value={name} />
        <Input placeholder="Enter your username" onChangeText={setUsername} value={username} />
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
              Creating your account...
            </Text>
          </View>
        </Animated.View>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <Button title="Next" onPress={onButtonClick} type="primary" />
        </View>
      )}
    </SafeAreaView>
  );
};
export default OnboardingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
