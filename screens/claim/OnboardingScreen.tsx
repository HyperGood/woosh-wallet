import { Feather } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as Sentry from '@sentry/react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Pressable, Image, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useWithdraw } from '../../hooks/DepositVault/useWithdraw';
import { useAuthentication } from '../../hooks/useAuthentication';
import { userAddressAtom } from '../../store/store';
import { minMaxScale, scale } from '../../utils/scalingFunctions';

interface OnboardingScreenProps {
  transactionData: any;
  id: string;
}

const OnboardingScreen = ({ transactionData, id }: OnboardingScreenProps) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(transactionData.recipientName || '');
  const [image, setImage] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(`${i18n.t('settingUpAccountLabel')}`);
  const { authenticate } = useAuthentication();
  const address = useAtomValue(userAddressAtom);
  const { withdraw } = useWithdraw();

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
      await authenticate();

      const reference = storage().ref(`avatars/${address}.jpg`);
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
    } catch (error) {
      console.error('Error in onboarding screen', error);
      Sentry.captureException(error);
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
      const withdrawHash = await withdraw(
        transactionData.depositIndex,
        transactionData.signature as `0x${string}`,
        address
      );
      //wait for transaction
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
      Sentry.captureException(error);
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
      quality: 0,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top }}>
        {isLoading ? (
          <Animated.View
            style={[
              {
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              },
              fadeInAnimatedStyle,
            ]}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              {/*It would be cool to have two progress bars one for each state */}
              <LoadingSpinner />
              <Text style={{ color: COLORS.light, fontSize: 24, marginTop: 16 }}>
                {loadingState}...
              </Text>
            </View>
          </Animated.View>
        ) : (
          <View style={{ flex: 1, width: '100%', justifyContent: 'space-between' }}>
            <Animated.View
              style={[
                {
                  width: '100%',
                  marginVertical: 16,
                  gap: 16,
                  alignItems: 'center',
                  paddingHorizontal: 16,
                },
                fadeOutAnimatedStyle,
              ]}>
              <Text style={styles.title}>{i18n.t('onboardingTitle')}</Text>
              <Input placeholder="Enter your name" onChangeText={setName} value={name} />
              <Input
                placeholder="Enter your username"
                onChangeText={setUsername}
                value={username}
              />
              <View style={{ width: '100%', padding: 16, gap: 16, alignItems: 'center' }}>
                <Text style={styles.profilePictureTitle}>{i18n.t('setProfilePicture')}</Text>
                <Pressable style={styles.imagePicker} onPress={pickImage}>
                  {image ? (
                    <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
                  ) : (
                    <View style={{ gap: 4, alignItems: 'center' }}>
                      <Feather name="camera" size={24} color={COLORS.dark} />
                      <Text>{i18n.t('uploadPhoto')}</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </Animated.View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
              <Button
                title={i18n.t('createAccountAndClaim')}
                onPress={onButtonClick}
                type="primary"
                disabled={!name || !username || !image}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default OnboardingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: minMaxScale(40, 48),
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: minMaxScale(48, 56),
    width: '100%',
  },
  profilePictureTitle: {
    color: COLORS.light,
    fontSize: minMaxScale(16, 24),
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
  },
  imagePicker: {
    height: scale(250),
    aspectRatio: 1,
    backgroundColor: COLORS.gray[400],
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
