import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';

import SessionProvider from '../store/auth-context';
import SmartAccountProvider from '../store/smart-account-context';

export const storage = new MMKV();

SplashScreen.preventAutoHideAsync();

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
    <SessionProvider>
      <SmartAccountProvider>
        <Slot />
      </SmartAccountProvider>
    </SessionProvider>
  );
}
