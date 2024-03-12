import { SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/global-styles';

import SettingsScreen from '../../../../screens/settingshelp/SettingsScreen';

export default function Page() {
  return (
    <SafeAreaView style={styles.wrapper}>
      <SettingsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.light,
    paddingTop: 24,
  },
});
