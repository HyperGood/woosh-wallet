import storage from '@react-native-firebase/storage';
import { Skeleton } from 'moti/skeleton';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import placeholderUser from '../../assets/images/profile.png';
import { COLORS, SkeletonCommonProps } from '../../constants/global-styles';
import { useUserData } from '../../store/UserDataContext';

const Header = () => {
  const { userData } = useUserData();

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
        console.log(url);
        setImageSrc(url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [reference]);

  return (
    <View style={styles.container}>
      <Skeleton.Group show={isLoading}>
        <Skeleton height={48} width={48} radius="round" {...SkeletonCommonProps}>
          <Image
            style={styles.image}
            source={typeof imageSrc === 'string' ? { uri: imageSrc } : imageSrc}
          />
        </Skeleton>
        <Skeleton height={24} width={200} {...SkeletonCommonProps}>
          <View>
            <Text style={styles.username}>${username}</Text>
          </View>
        </Skeleton>
      </Skeleton.Group>
    </View>
  );
};
export default Header;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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
