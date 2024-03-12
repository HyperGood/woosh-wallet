import { SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/global-styles';

import HelpScreen from '../../../../screens/settingshelp/HelpScreen';

const help = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <HelpScreen />
    </SafeAreaView>
  );
};

export default help;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary[400],
    paddingTop: 24,
  },
});
