import { LocalAccountSigner } from '@alchemy/aa-core';
import * as Sentry from '@sentry/react-native';
import { ECDSAProvider } from '@zerodev/sdk';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { fetchUserByEthAddress } from '../../api/firestoreService';
import { useSession } from '../../store/AuthContext';
import { ContactProvider } from '../../store/ContactsContext';
import { useAccount } from '../../store/SmartAccountContext';
import { useUserData } from '../../store/UserDataContext';

export default function Layout() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSession();
  const { setEcdsaProvider } = useAccount();
  const { setUserData, setIsFetchingUserData } = useUserData();

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          setLoading(true);
          const ecdsaProvider = await ECDSAProvider.init({
            projectId: process.env.EXPO_PUBLIC_ZERODEV_ID || '',
            owner: LocalAccountSigner.privateKeyToAccountSigner(token as `0x${string}`),
          });
          setEcdsaProvider(ecdsaProvider);
          console.log('Zerodev Provider set');
          setAddress(await ecdsaProvider.getAddress());

          setLoading(false);
        } catch (e) {
          console.log(e);
          Sentry.captureException(e);
        }
      })();
    }
  }, [token]);

  useEffect(() => {
    if (address) {
      setIsFetchingUserData(true);
      fetchUserByEthAddress(address)
        .then((user) => {
          setUserData(user);
          setIsFetchingUserData(false);
        })
        .catch((e) => {
          console.error(e);
          Sentry.captureException(e);
          setIsFetchingUserData(false);
        });
    }
  }, [address]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <ContactProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ContactProvider>
  );
}
