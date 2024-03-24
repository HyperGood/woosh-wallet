import * as Sentry from '@sentry/react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { Alert } from 'react-native';
import { encodeFunctionData, parseUnits } from 'viem';

import { chain } from '../../constants/viemPublicClient';
import { AUSDCTokenAddresses, aUSDcAddress } from '../../references/tokenAddresses';
import { kernelClientAtom, smartAccountAtom } from '../../store/store';

export const useSendUSDc = () => {
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [transactionError, setTransactionError] = useState<any>(null);
  const kernelClient = useAtomValue(kernelClientAtom);
  const account = useAtomValue(smartAccountAtom);
  const chainId = chain.id;
  const tokenAddress = aUSDcAddress[chainId as keyof AUSDCTokenAddresses][0];
  const tokenDecimals = 6;

  const sendUSDc = async (amount: string, recipientAddress: `0x${string}`) => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (hasHardware) {
        const authResult = await LocalAuthentication.authenticateAsync();
        if (!authResult.success) {
          Alert.alert('Authentication Failed!!');
          return;
        }
        setIsSending(true);
        if (!kernelClient) throw new Error('No Kernel Client');
        if (!account) throw new Error('No Account');
        console.log('Sending ');

        const sendHash = await kernelClient.sendUserOperation({
          userOperation: {
            callData: await account?.encodeCallData({
              to: tokenAddress,
              value: BigInt(0),
              data: encodeFunctionData({
                abi: [
                  {
                    inputs: [
                      { internalType: 'address', name: 'to', type: 'address' },
                      { internalType: 'uint256', name: 'value', type: 'uint256' },
                    ],
                    name: 'transfer',
                    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                    stateMutability: 'nonpayable',
                    type: 'function',
                  },
                  {
                    inputs: [],
                    name: 'decimals',
                    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                    stateMutability: 'view',
                    type: 'function',
                  },
                ],
                functionName: 'transfer',
                args: [recipientAddress, parseUnits(amount, tokenDecimals)],
              }),
            }),
          },
          account,
        });
        setTransactionHash(sendHash);
        setIsSending(false);
      }
    } catch (e) {
      setTransactionError(e);
      console.log(e);
      Sentry.captureException(e);
      Alert.alert('Transaction Failed!!');
    } finally {
      setIsSending(false);
    }
  };

  return { sendUSDc, transactionHash, isSending, transactionError };
};
