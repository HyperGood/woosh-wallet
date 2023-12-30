import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../../constants/global-styles';
import EnterAmountScreen from '../../../screens/send/EnterAmountScreen';

const enterAmount = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <EnterAmountScreen />
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
