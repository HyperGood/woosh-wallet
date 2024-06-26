import storage from '@react-native-firebase/storage';
import * as Sentry from '@sentry/react-native';
import { Link, router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Skeleton } from 'moti/skeleton';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import QRIcon from '../../assets/images/icons/QRIcon';
import placeholderUser from '../../assets/images/profile.png';
import { COLORS, SkeletonCommonProps } from '../../constants/global-styles';
import { useUserData } from '../../store/UserDataContext';
import { userAddressAtom } from '../../store/store';
import { scale } from '../../utils/scalingFunctions';

const Header = () => {
  const { userData, isFetchingUserData } = useUserData();
  const address = useAtomValue(userAddressAtom);
  const [username, setUsername] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isFetchingUserData);
  }, [isFetchingUserData]);

  useEffect(() => {
    if (userData || address) {
      console.log('userData:', userData);
      console.log('address:', address);
      const truncatedAddress = address?.slice(0, 4) + '...' + address?.slice(-4);
      setUsername(userData?.username || truncatedAddress);
    }
  }, [userData, address]);

  const [imageSrc, setImageSrc] = useState<any>(placeholderUser);

  useEffect(() => {
    if (!address) {
      return;
    }
    const fetchImage = async () => {
      try {
        const reference = storage().ref(`avatars/${address}.jpg`);
        const url = await reference.getDownloadURL();
        setImageSrc(url);
      } catch (error) {
        console.log('Error fetching image:', error);
        Sentry.captureException(error);
        setImageSrc(placeholderUser);
      }
    };

    fetchImage();
  }, [address]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Skeleton show={isLoading} height={48} width={48} radius="round" {...SkeletonCommonProps}>
          <Pressable onPress={() => router.push('/settingshelp/')}>
            <Image
              style={styles.image}
              source={typeof imageSrc === 'string' ? { uri: imageSrc } : imageSrc}
            />
          </Pressable>
        </Skeleton>
        <Skeleton show={isLoading} height={24} width={200} {...SkeletonCommonProps}>
          <Link href="/settingshelp/" asChild>
            <Text style={styles.username}>{username}</Text>
          </Link>
        </Skeleton>
      </View>

      <Pressable onPress={() => router.push('/(tabs)/(home)/qr')}>
        <QRIcon color={COLORS.dark} />
      </Pressable>
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
    paddingHorizontal: 16,
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
