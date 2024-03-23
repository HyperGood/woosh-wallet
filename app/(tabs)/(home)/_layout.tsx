import * as Sentry from '@sentry/react-native';
import { Redirect, Stack } from 'expo-router';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { fetchUserByEthAddress } from '../../../api/firestoreService';
import { ContactProvider } from '../../../store/ContactsContext';
import { useUserData } from '../../../store/UserDataContext';
import { authAtom, userAddressAtom } from '../../../store/store';

export default function Layout() {
  const address = useAtomValue(userAddressAtom);
  const [token] = useAtom(authAtom);
  const { setUserData, setIsFetchingUserData } = useUserData();

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
