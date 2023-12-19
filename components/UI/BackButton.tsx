import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../constants/global-styles';
const BackButton = () => {
  return (
    <View style={styles.container}>
      <Feather name="corner-up-left" size={16} color={COLORS.light} />
      <Text style={styles.text}>Back</Text>
    </View>
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
