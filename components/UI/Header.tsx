import { Feather } from '@expo/vector-icons';
import storage from '@react-native-firebase/storage';
import * as Sentry from '@sentry/react-native';
import * as Clipboard from 'expo-clipboard';
import { Skeleton } from 'moti/skeleton';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import placeholderUser from '../../assets/images/profile.png';
import { COLORS, SkeletonCommonProps } from '../../constants/global-styles';
import { useSession } from '../../store/AuthContext';
import { useAccount } from '../../store/SmartAccountContext';
import { useUserData } from '../../store/UserDataContext';
import { scale } from '../../utils/scalingFunctions';

const Header = () => {
  const { userData, isFetchingUserData } = useUserData();
  const { address } = useAccount();
  const { logout } = useSession();
  const [username, setUsername] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isFetchingUserData);
  }, [isFetchingUserData]);

  useEffect(() => {
    if (userData || address) {
      console.log('userData:', userData);
      const truncatedAddress = address?.slice(0, 4) + '...' + address?.slice(-4);
      setUsername(userData?.username || truncatedAddress);
    }
  }, [userData, address]);

  const name = userData?.name;
  const reference = storage().ref(`avatars/${name}.jpg`);
  const [imageSrc, setImageSrc] = useState<any>(placeholderUser);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await reference.getDownloadURL();
        setImageSrc(url);
      } catch (error) {
        console.log('Error fetching image:', error);
        Sentry.captureException(error);
        setImageSrc(placeholderUser);
      }
    };

    fetchImage();
  }, [reference]);

  const copyAddressToClipboard = async () => {
    await Clipboard.setStringAsync(address || 'No address found');
    Alert.alert('Copied address clipboard!');
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Skeleton show={isLoading} height={48} width={48} radius="round" {...SkeletonCommonProps}>
          <Pressable onPress={copyAddressToClipboard}>
            <Image
              style={styles.image}
              source={typeof imageSrc === 'string' ? { uri: imageSrc } : imageSrc}
            />
          </Pressable>
        </Skeleton>
        <Skeleton show={isLoading} height={24} width={200} {...SkeletonCommonProps}>
          <View>
            <Text style={styles.username}>{username}</Text>
          </View>
        </Skeleton>
      </View>

      <View>
        <Pressable onPress={logout}>
          <Feather name="log-out" color={COLORS.light} size={24} />
        </Pressable>
      </View>
    </View>
  );
};
export default Header;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    width: '100%',
    marginBottom: scale(24),
    paddingTop: 16,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  username: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    letterSpacing: -0.02,
    color: COLORS.dark,
  },
});
