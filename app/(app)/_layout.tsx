import { LocalAccountSigner } from '@alchemy/aa-core';
import { ZeroDevConnector } from '@zerodev/wagmi';
import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useConnect } from 'wagmi';

import { useSession } from '../../store/auth-context';
import { chains } from '../_layout';

export default function Layout() {
  const { token } = useSession();
  const { connect } = useConnect();

  useEffect(() => {
    if (token) {
      try {
        connect({
          connector: new ZeroDevConnector({
            chains,
            options: {
              projectId: process.env.EXPO_PUBLIC_ZERODEV_ID,
              owner: LocalAccountSigner.privateKeyToAccountSigner(token as `0x${string}`),
            },
          }),
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [token]);
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
