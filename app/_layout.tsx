import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { optimism, optimismGoerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import SessionProvider from '../store/auth-context';
import SmartAccountProvider from '../store/smart-account-context';

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
  const [fontsLoaded, fontError] = useFonts({
    Satoshi: require('../assets/fonts/Satoshi-Regular.ttf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.ttf'),
    FHOscar: require('../assets/fonts/FHOscar-Medium.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <WagmiConfig config={config}>
      <SessionProvider>
        <SmartAccountProvider>
          <Slot />
        </SmartAccountProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
