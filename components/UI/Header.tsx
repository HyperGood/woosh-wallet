import storage from '@react-native-firebase/storage';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import placeholderUser from '../../assets/images/profile.png';
import { COLORS } from '../../constants/global-styles';
import { useUserData } from '../../store/UserDataContext';
const Header = () => {
  const { userData } = useUserData();

  if (!userData) {
    throw new Error('User data is not available');
  }

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
      <Image
        style={styles.image}
        source={typeof imageSrc === 'string' ? { uri: imageSrc } : imageSrc}
      />
      <View>
        <Text style={styles.username}>${username}</Text>
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
