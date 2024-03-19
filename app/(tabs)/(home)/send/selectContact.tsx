import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../../../constants/global-styles';
import SelectContactScreen from '../../../../screens/send/SelectContactScreen';

const enterAmount = () => {
  return (
    <View style={styles.wrapper}>
      <SelectContactScreen />
    </View>
  );
};

export default enterAmount;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
});
