import { SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/global-styles';

import HelpScreen from '../../../../screens/settingshelp/HelpScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const help = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[{ paddingTop: insets.top + 24 }, styles.wrapper]}>
      <HelpScreen />
    </SafeAreaView>
  );
};

export default help;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary[400],
    paddingHorizontal: 10,
  },
});
