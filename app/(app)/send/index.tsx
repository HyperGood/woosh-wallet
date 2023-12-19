import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../../constants/global-styles';
import SelectContact from '../../../screens/send/SelectContact';
const index = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <SelectContact />
      </View>
    </View>
  );
};
export default index;
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
