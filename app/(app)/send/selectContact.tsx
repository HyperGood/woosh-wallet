import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../../constants/global-styles';
import SelectContactScreen from '../../../screens/send/SelectContactScreen';

const enterAmount = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <SelectContactScreen />
      </View>
    </View>
  );
};

export default enterAmount;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 72,
  },
});
