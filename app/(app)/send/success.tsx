import { StyleSheet, View } from 'react-native';

import SuccessScreen from '../../../screens/send/SuccessScreen';

const Success = () => {
  return (
    <View style={styles.wrapper}>
      <SuccessScreen />
    </View>
  );
};

export default Success;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
});
