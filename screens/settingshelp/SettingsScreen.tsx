import { Feather } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as Sentry from '@sentry/react-native';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Skeleton } from 'moti/skeleton';
import { useEffect, useState } from 'react';
import { Pressable, Image, StyleSheet, Text, View, TextInput, Alert } from 'react-native';

import placeholderUser from '../../assets/images/profile.png';
import SettingsOption from '../../components/settings/SettingsOption';
import { COLORS, SkeletonCommonProps } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useAuthentication } from '../../hooks/useAuthentication';
import { useUserData } from '../../store/UserDataContext';
import { userAddressAtom } from '../../store/store';

const SettingsScreen = () => {
  const { logout } = useAuthentication();
  const { userData, isFetchingUserData } = useUserData();
  const address = useAtomValue(userAddressAtom);
  const [username, setUsername] = useState('');
  const [joinedOn, setJoinedOn] = useState('');
  const name = userData?.name;
  const reference = storage().ref(`avatars/${address}.jpg`);
  const [image, setImage] = useState<any>(placeholderUser);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await reference.getDownloadURL();
        setImage(url);
        console.log('Name:' + name);
      } catch (error) {
        console.log('Error fetching image:', error);
        Sentry.captureException(error);
        setImage(placeholderUser);
      }
    };

    fetchImage();
  }, []);

  useEffect(() => {
    if (userData || address) {
      console.log('userData:', userData);
      const truncatedAddress = address?.slice(0, 4) + '...' + address?.slice(-4);
      setUsername(userData?.username || truncatedAddress);
    }
  }, [userData, address]);

  useEffect(() => {
    getJoinedOn();
  }, [isFetchingUserData]);

  function getJoinedOn(): void {
    firestore()
      .collection('users')
      .doc(userData?.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const createdAtDate = doc.data()?.createdAt.toDate();
          setJoinedOn(
            `${createdAtDate.getDate()}/${createdAtDate.getMonth() + 1}/${createdAtDate.getFullYear()}`
          );
        } else {
          console.log('No existe ningún registro del usuario');
        }
      })
      .catch((error) => {
        console.error('Error al obtener el documento:', error);
      });
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('Updating image...');
      try {
        console.log('Saving profile picture');

        const task = await reference.putFile(result.assets[0].uri);
        task.state === 'success' && console.log('Profile picture uploaded');
        const url = await reference.getDownloadURL();
        firestore().collection('users').doc(userData.id).update({
          profilePicture: url,
        });
        setImage(result.assets[0].uri);
      } catch (error) {
        console.error('Error saving profile picture', error);
        //Sentry.captureException(error);
      }
    }
  };

  const updateNameFunction = (newName: string) => {
    if (newName === '') {
      console.log('Name cannot be empty');
      return;
    }
    try {
      firestore().collection('users').doc(userData.id).update({
        name: newName,
      });
    } catch (error) {
      console.error('Error updating name', error);
      Sentry.captureException(error);
    }
    setUsername(newName);
  };

  const copyAddressToClipboard = async () => {
    await Clipboard.setStringAsync(address || 'No address found');
    Alert.alert('Copied address to clipboard!');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.exit} onPress={() => router.navigate('/')}>
        <Feather name="x" size={24} color="#444447" />
      </Pressable>
      <View style={{ flexDirection: 'row', marginTop: 56 }}>
        <Pressable style={{ justifyContent: 'center' }} onPress={pickImage}>
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            style={styles.userImage}
          />
        </Pressable>

        <View style={{ justifyContent: 'center', paddingLeft: 18 }}>
          <Skeleton show={isFetchingUserData} radius="round" {...SkeletonCommonProps}>
            <Text style={styles.account}>
              {userData.username ? `${userData.username}` : userData.ethAddress}
            </Text>
          </Skeleton>
          <Skeleton show={isFetchingUserData} radius="round" {...SkeletonCommonProps}>
            <Text style={styles.joinedOn}>
              {i18n.t('joinedOn')}: {joinedOn}
            </Text>
          </Skeleton>
        </View>
      </View>
      <View style={{ marginTop: 30, marginBottom: 16 }}>
        <View>
          <Text style={styles.upperInputText}>{i18n.t('name')}</Text>
          <View style={styles.inputContainer}>
            <Skeleton show={isFetchingUserData} width={160} radius="round" {...SkeletonCommonProps}>
              <TextInput
                style={styles.textInput}
                placeholder={userData.name}
                onSubmitEditing={(event) => {
                  updateNameFunction(event.nativeEvent.text);
                }}
                placeholderTextColor={COLORS.dark}
              />
            </Skeleton>
            <View style={styles.iconContainer}>
              <Feather name="edit-2" size={16} color="black" />
            </View>
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <Text style={styles.upperInputText}>{i18n.t('ethAddress')}</Text>
          <Pressable style={styles.inputContainer} onPress={copyAddressToClipboard}>
            <Text style={styles.textInput}>{address}</Text>
            <View style={styles.iconContainer}>
              <Feather name="link" size={16} color="black" />
            </View>
          </Pressable>
        </View>
      </View>
      <SettingsOption
        icon="help-circle"
        label={i18n.t('help')}
        onPress={() => router.push('/settingshelp/help')}
        color="#00A3FF"
      />
      <SettingsOption
        icon="bell"
        label={i18n.t('notifications')}
        onPress={() => true}
        color="#FFDE68"
      />
      <SettingsOption icon="eye" label={i18n.t('theme')} onPress={() => true} color="#1EE51E" />
      <SettingsOption
        icon="eye-off"
        label={i18n.t('logOut')}
        onPress={() => logout()}
        color="#FF1568"
      />
      <View
        style={{
          alignItems: 'center',
          opacity: 0.4,
          width: '100%',
          flexGrow: 1,
          justifyContent: 'flex-end',
        }}>
        <Text style={styles.testText}>Tesnet Mode</Text>
        <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'space-between' }}>
          <Text style={styles.testText}>Network: Base Sepolia</Text>
          <Text style={styles.testText}>Build 01 - (03/25/2024)</Text>
        </View>
        <Text style={styles.testText}>{'Made with <3 in Mexico by HyperGood'}</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exit: {
    position: 'absolute',
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  account: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    letterSpacing: -0.2,
    color: COLORS.dark,
    marginBottom: 3,
  },
  joinedOn: {
    fontFamily: 'Satoshi',
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: -0.2,
    color: COLORS.dark,
  },
  upperInputText: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
  },
  textInput: {
    fontSize: 17,
    fontFamily: 'Satoshi',
    width: '100%',
    textAlignVertical: 'center',
    zIndex: 2,
  },
  inputContainer: {
    height: 65,
    width: '100%',
    backgroundColor: '#DADADA',
    justifyContent: 'center',
    paddingLeft: 16,
    borderRadius: 16,
    opacity: 1,
    paddingRight: 48,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testText: {
    fontSize: 14,
    fontFamily: 'Satoshi',
    marginVertical: 4,
    color: '#444447',
  },
});
