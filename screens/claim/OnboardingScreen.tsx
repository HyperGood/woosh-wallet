import { LocalAccountSigner } from '@alchemy/aa-core';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { ECDSAProvider } from '@zerodev/sdk';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Pressable, Image } from 'react-native';
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
import i18n from '../../constants/i18n';
import { useWithdraw } from '../../hooks/DepositVault/useWithdraw';
import { useSession } from '../../store/AuthContext';
import { useAccount } from '../../store/SmartAccountContext';

interface OnboardingScreenProps {
  transactionData: any;
  id: string;
}

const OnboardingScreen = ({ transactionData, id }: OnboardingScreenProps) => {
  const [name, setName] = useState(transactionData.sender || '');
  const [image, setImage] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(`${i18n.t('settingUpAccountLabel')}`);
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const { authenticate } = useSession();
  const { setEcdsaProvider } = useAccount();
  const { withdraw } = useWithdraw();
  const reference = storage().ref(`avatars/${name}.jpg`);

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

      console.log('Saving profile picture');

      const task = await reference.putFile(image);
      task.state === 'success' && console.log('Profile picture uploaded');
      const url = await reference.getDownloadURL();
      firestore().collection('users').add({
        name,
        username,
        ethAddress: address,
        createdAt: firestore.FieldValue.serverTimestamp(),
        profilePicture: url,
      });
      console.log('Database set');
      setAddress(address);
      //Go to claim screen
      //nextScreenFunction();
    } catch (error) {
      console.error('Error in onboarding screen', error);
      setIsLoading(false);
      // Handle error
    }
  };

  const claimFunction = async () => {
    fadeOutAnim.value = withTiming(0, { duration: 500 }); // Start fade out
    fadeInAnim.value = withDelay(500, withTiming(1, { duration: 200 })); // Start fade in

    setIsLoading(true);
    setLoadingState(`${i18n.t('claimingFundsLabel')}`);
    try {
      //Claim the transaction
      console.log('Claiming...');
      console.log('Transaction data: ', transactionData);
      if (!address) {
        console.log('No address');
        setIsLoading(false);
        return;
      }
      if (!transactionData.signature) {
        console.log('No secret');
        setIsLoading(false);
        return;
      }

      console.log('Executing withdraw');
      //400 error thrown here but everything works
      const withdrawHash = await withdraw(
        transactionData.depositIndex,
        transactionData.signature as `0x${string}`,
        address
      );
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

  useEffect(() => {
    if (!address) {
      console.log('No address');
      return;
    }
    claimFunction();
  }, [address]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          { width: '100%', marginTop: 64, gap: 16, alignItems: 'center' },
          fadeOutAnimatedStyle,
        ]}>
        <Text style={styles.title}>{i18n.t('onboardingTitle')}</Text>
        <Input placeholder="Enter your name" onChangeText={setName} value={name} />
        <Input placeholder="Enter your username" onChangeText={setUsername} value={username} />
        <View style={{ width: '100%', padding: 16, gap: 16, alignItems: 'center' }}>
          <Text style={{ color: COLORS.light, fontSize: 24, fontFamily: 'Satoshi-Bold' }}>
            {i18n.t('setProfilePicture')}
          </Text>
          <Pressable style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
            ) : (
              <Text>{i18n.t('uploadPhoto')}</Text>
            )}
          </Pressable>
        </View>
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
              {loadingState}...
            </Text>
          </View>
        </Animated.View>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <Button title={i18n.t('createAccountAndClaim')} onPress={onButtonClick} type="primary" />
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
  imagePicker: {
    height: 250,
    aspectRatio: 1,
    backgroundColor: COLORS.gray[600],
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
