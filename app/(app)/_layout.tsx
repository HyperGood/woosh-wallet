import { LocalAccountSigner } from '@alchemy/aa-core';
import { ECDSAProvider } from '@zerodev/sdk';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { useSession } from '../../store/AuthContext';
import { ContactProvider } from '../../store/ContactsContext';
import { useAccount } from '../../store/SmartAccountContext';
import { useUserData } from '../../store/UserDataContext';
import { fetchUserByEthAddress } from '../../api/firestoreService';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

export default function Layout() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(true);
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
      setUserDataLoading(true);

      fetchUserByEthAddress(address).then((user) => {
        setUserData(user);
        setUserDataLoading(false);
      });
    }
  }, [address]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (loading || userDataLoading) {
    return <LoadingIndicator isLoading />;
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
