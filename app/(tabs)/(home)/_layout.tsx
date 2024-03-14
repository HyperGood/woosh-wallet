import * as Sentry from '@sentry/react-native';
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator';
import { KernelAccountClient, createKernelAccount, createKernelAccountClient } from '@zerodev/sdk';
import { Redirect, Stack } from 'expo-router';
import { type UserOperation } from 'permissionless';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { useEffect, useState } from 'react';
import { Hex, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

import { fetchUserByEthAddress } from '../../../api/firestoreService';
import publicClient from '../../../constants/viemPublicClient';
import { useSession } from '../../../store/AuthContext';
import { ContactProvider } from '../../../store/ContactsContext';
import { useSmartAccount } from '../../../store/SmartAccountContext';
import { useUserData } from '../../../store/UserDataContext';

export default function Layout() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSession();
  const { setKernelClient, setAccount } = useSmartAccount();
  const { setUserData, setIsFetchingUserData } = useUserData();

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          setLoading(true);
          const signer = privateKeyToAccount(token as Hex);

          const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
            signer,
          });

          const account = await createKernelAccount(publicClient, {
            plugins: {
              sudo: ecdsaValidator,
            },
          });

          const kernelClient = createKernelAccountClient({
            account,
            chain: sepolia,
            transport: http(process.env.EXPO_PUBLIC_BUNDLER_URL),
            sponsorUserOperation: async ({ userOperation }): Promise<UserOperation> => {
              const paymasterClient = createPimlicoPaymasterClient({
                chain: sepolia,
                transport: http(process.env.EXPO_PUBLIC_PAYMASTER_URL),
              });
              return paymasterClient.sponsorUserOperation({
                userOperation,
                entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
              });
            },
          });

          console.log('Zerodev Provider set');
          setAddress(kernelClient.account.address);
          setKernelClient(kernelClient as KernelAccountClient);
          setAccount(account);
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
