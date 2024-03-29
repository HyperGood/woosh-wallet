import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator';
import { KernelAccountClient, createKernelAccount, createKernelAccountClient } from '@zerodev/sdk';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useAtom } from 'jotai';
import { type UserOperation } from 'permissionless';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { Hex, http } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

import publicClient from '../constants/viemPublicClient';
import { authAtom, kernelClientAtom, smartAccountAtom, userAddressAtom } from '../store/store';

export const useAuthentication = () => {
  const [, setAuthToken] = useAtom(authAtom);
  const [, setAddress] = useAtom(userAddressAtom);
  const [, setKernelClient] = useAtom(kernelClientAtom);
  const [, setSmartAccount] = useAtom(smartAccountAtom);

  async function authenticate(): Promise<string | boolean> {
    return new Promise((resolve, reject) => {
      SecureStore.getItemAsync('token').then(async (storedToken) => {
        if (storedToken) {
          LocalAuthentication.authenticateAsync().then((result) => {
            setAuthToken(storedToken);
            resolve(storedToken);
          });
        } else {
          LocalAuthentication.authenticateAsync().then(async (result) => {
            if (result.success) {
              console.log('Authentication succeeded, generating private key');
              const privateKey = generatePrivateKey();
              console.log('Private key: ', privateKey);
              if (privateKey) {
                setAuthToken(privateKey);
                await SecureStore.setItemAsync('token', privateKey);
                resolve(privateKey);
              } else {
                reject(new Error('Failed to generate private key'));
              }
            } else {
              reject(new Error('Authentication failed'));
            }
          });
        }
        const signer = privateKeyToAccount(storedToken as Hex);
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
        setAddress(kernelClient.account.address);
        console.log('Address is set');
        setKernelClient(kernelClient as KernelAccountClient);
        console.log('Kernel client is set');
        setSmartAccount(account);
        console.log('Smart account is set');
      });
    });
  }

  async function deletePrivateKey() {
    console.log('Deleting private key');
    await SecureStore.deleteItemAsync('token');
    setAuthToken(null);
  }

  async function logout() {
    console.log('Logging out');
    setAuthToken(null);
  }

  return { authenticate, deletePrivateKey, logout };
};
