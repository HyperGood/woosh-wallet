<<<<<<< HEAD
=======
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
>>>>>>> parent of f5126bb (Add buttons and header styles)
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { optimism, optimismGoerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [process.env.EXPO_PUBLIC_TESTNET === 'true' ? optimismGoerli : optimism],
  [alchemyProvider({ apiKey: process.env.EXPO_PUBLIC_ALCHEMY_ID || '' }), publicProvider()]
);

const config = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
});

export default function Layout() {
<<<<<<< HEAD
  const [fontsLoaded, fontError] = useFonts({
=======
  const router = useRouter();
  const [fontsLoaded] = useFonts({
>>>>>>> parent of f5126bb (Add buttons and header styles)
    Satoshi: require('../assets/fonts/Satoshi-Regular.ttf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.ttf'),
    FHOscar: require('../assets/fonts/FHOscar-Medium.otf'),
  });

<<<<<<< HEAD
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);
=======
  const BackButton = () => (
    <TouchableOpacity onPress={router.back}>
      <View style={styles.backButton}>
        <Feather name="chevron-left" size={16} color="#007AFF" />
        <Text style={styles.backButtonText}>Back</Text>
      </View>
    </TouchableOpacity>
  );
>>>>>>> parent of f5126bb (Add buttons and header styles)

  if (!fontsLoaded) {
    return null;
  }

  return (
<<<<<<< HEAD
    <WagmiConfig config={config}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Overview', headerShown: false }} />
      </Stack>
    </WagmiConfig>
=======
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Overview' }} />
      <Stack.Screen
        name="details"
        options={{ title: 'Details', headerLeft: () => <BackButton /> }}
      />
    </Stack>
>>>>>>> parent of f5126bb (Add buttons and header styles)
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
