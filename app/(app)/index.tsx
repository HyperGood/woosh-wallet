import { View, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';
import HomeScreen from '../../screens/HomeScreen';

export default function Page() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <HomeScreen />
      </View>
    </View>
  );
}

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
