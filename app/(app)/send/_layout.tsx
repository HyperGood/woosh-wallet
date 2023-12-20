import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../../constants/global-styles';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     backgroundColor: COLORS.dark,
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: 72,
//   },
// });
