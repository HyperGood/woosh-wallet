import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';

interface BackButtonProps {
  backFunction?: () => void;
  size?: number;
}

const BackButton = ({ backFunction, size = 24 }: BackButtonProps) => {
  function goBack() {
    if (backFunction) {
      backFunction();
    } else {
      router.back();
    }
  }
  return (
    <Pressable style={styles.container} onPress={goBack}>
      <Feather name="corner-up-left" size={size} color={COLORS.light} />
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
