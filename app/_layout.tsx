import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import { Slot, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { MMKV } from 'react-native-mmkv';

import SessionProvider from '../store/AuthContext';
import SmartAccountProvider from '../store/SmartAccountContext';
import UserDataProvider from '../store/UserDataContext';

export const storage = new MMKV();

SplashScreen.preventAutoHideAsync();

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: true,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});

function Layout() {
  const ref = useNavigationContainerRef();
  const [fontsLoaded, fontError] = useFonts({
    Satoshi: require('../assets/fonts/Satoshi-Regular.ttf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.ttf'),
    FHOscar: require('../assets/fonts/FHOscar-Medium.otf'),
  });

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

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
        <UserDataProvider>
          <StatusBar barStyle="light-content" />
          <Slot />
        </UserDataProvider>
      </SmartAccountProvider>
    </SessionProvider>
  );
}

export default Sentry.wrap(Layout);
