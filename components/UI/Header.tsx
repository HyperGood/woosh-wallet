import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../constants/global-styles';
const Header = () => {
  const username = 'janetbermudez';
  const imageSrc = '../../assets/images/temp/janet.jpg';
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require(imageSrc)} />
      <Text style={styles.username}>${username}</Text>
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
