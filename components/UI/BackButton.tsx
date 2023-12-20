import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS } from '../../constants/global-styles';

const BackButton = () => {
  function goBack() {
    router.back();
  }
  return (
    <Pressable style={styles.container} onPress={goBack}>
      <Feather name="corner-up-left" size={16} color={COLORS.light} />
      <Text style={styles.text}>Back</Text>
    </Pressable>
  );
};
export default BackButton;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  text: {
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
  },
});
