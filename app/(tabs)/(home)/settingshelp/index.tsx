import { StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../../../../constants/global-styles';
import SettingsScreen from '../../../../screens/settingshelp/SettingsScreen';

export default function Page() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={[{ paddingTop: insets.top + 24 }, styles.wrapper]}>
      <SettingsScreen />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.light,
    paddingHorizontal: 10,
  },
});
