import { SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/global-styles';

import SettingsScreen from '../../../../screens/settingshelp/SettingsScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Page() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[{ paddingTop: insets.top + 24 }, styles.wrapper]}>
      <SettingsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.light,
    paddingHorizontal: 10,
  },
});
