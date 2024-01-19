import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../../constants/global-styles';
import RequestEnterAmountScreen from '../../../screens/request/RequestEnterAmountScreen';

const enterAmount = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <RequestEnterAmountScreen />
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
