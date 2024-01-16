import { Feather } from '@expo/vector-icons';
import storage from '@react-native-firebase/storage';
import { Skeleton } from 'moti/skeleton';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Sentry from 'sentry-expo';

import placeholderUser from '../../assets/images/profile.png';
import { COLORS, SkeletonCommonProps } from '../../constants/global-styles';
import { useSession } from '../../store/AuthContext';
import { useUserData } from '../../store/UserDataContext';

const Header = () => {
  const { userData } = useUserData();
  const { deletePrivateKey, logout } = useSession();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setIsLoading(false);
    }
  }, [userData]);

  const username = userData?.username || 'username';
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
        Sentry.Native.captureException(error);
        setImageSrc(placeholderUser);
      }
    };

    fetchImage();
  }, [reference]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Skeleton show={isLoading} height={48} width={48} radius="round" {...SkeletonCommonProps}>
          <Pressable onPress={deletePrivateKey}>
            <Image
              style={styles.image}
              source={typeof imageSrc === 'string' ? { uri: imageSrc } : imageSrc}
            />
          </Pressable>
        </Skeleton>
        <Skeleton show={isLoading} height={24} width={200} {...SkeletonCommonProps}>
          <View>
            <Text style={styles.username}>${username}</Text>
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
    marginBottom: 40,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: COLORS.gray[400],
    borderWidth: 1,
  },
  username: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    letterSpacing: -0.02,
    color: COLORS.primary[400],
  },
});
