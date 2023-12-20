import { LocalAccountSigner } from '@alchemy/aa-core';
import { ECDSAProvider } from '@zerodev/sdk';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { useSession } from '../../store/auth-context';

export default function Layout() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSession();

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          setLoading(true);
          const ecdsaProvider = await ECDSAProvider.init({
            projectId: process.env.EXPO_PUBLIC_ZERODEV_ID || '',
            owner: LocalAccountSigner.privateKeyToAccountSigner(token as `0x${string}`),
          });
          setAddress(await ecdsaProvider.getAddress());
          setLoading(false);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [token]);

  useEffect(() => {
    console.log('Address: ', address);
  }, [address]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
