import { Stack } from 'expo-router';

import EnterAmount from '../../../screens/send/EnterAmount';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../../constants/global-styles';
import SelectContact from '../../../screens/send/SelectContact';

const enterAmount = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Stack.Screen />
        <SelectContact />
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
