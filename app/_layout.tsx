import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function Layout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Satoshi: require('../assets/fonts/Satoshi-Regular.ttf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.ttf'),
    FHOscar: require('../assets/fonts/FHOscar-Medium.otf'),
  });

  const BackButton = () => (
    <TouchableOpacity onPress={router.back}>
      <View style={styles.backButton}>
        <Feather name="chevron-left" size={16} color="#007AFF" />
        <Text style={styles.backButtonText}>Back</Text>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Overview' }} />
      <Stack.Screen
        name="details"
        options={{ title: 'Details', headerLeft: () => <BackButton /> }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
  },
  backButtonText: {
    color: '#007AFF',
    marginLeft: 4,
  },
});
