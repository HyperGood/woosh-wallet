import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../../../../constants/global-styles';
import HelpScreen from '../../../../screens/settingshelp/HelpScreen';

const Help = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[{ paddingTop: insets.top + 24 }, styles.wrapper]}>
      <HelpScreen />
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary[400],
    paddingHorizontal: 10,
  },
});
