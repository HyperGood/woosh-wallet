import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../../../constants/global-styles';
import EnterRecipientScreen from '../../../../screens/send/EnterRecipientScreen';

const recipient = () => {
  return (
    <View style={styles.wrapper}>
      <EnterRecipientScreen />
    </View>
  );
};

export default recipient;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
});
