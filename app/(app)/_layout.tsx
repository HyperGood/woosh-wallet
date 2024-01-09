import { LocalAccountSigner } from '@alchemy/aa-core';
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
  const { setUserData } = useUserData();

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
        }
      })();
    }
  }, [token]);

  useEffect(() => {
    console.log('Address: ', address);
    if (address) {
      fetchUserByEthAddress(address).then((user) => {
        setUserData(user);
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
