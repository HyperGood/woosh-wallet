import * as Sentry from '@sentry/react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import { Alert } from 'react-native';
import { encodeFunctionData, parseUnits } from 'viem';

import { chain } from '../../constants/viemPublicClient';
import { usdcAddress, TokenAddresses } from '../../references/tokenAddresses';
import { useAccount } from '../../store/SmartAccountContext';

export const useSendUSDc = () => {
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [transactionError, setTransactionError] = useState<any>(null);
  const { ecdsaProvider } = useAccount();
  const chainId = chain.id;
  const tokenAddress = usdcAddress[chainId as keyof TokenAddresses][0];
  const tokenDecimals = 6;

  const sendUSDc = async (amount: string, recipientAddress: `0x${string}`) => {
    setIsSending(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (hasHardware) {
        const authResult = await LocalAuthentication.authenticateAsync();
        if (!authResult.success) {
          Alert.alert('Authentication Failed!!');
          return;
        }
        if (!ecdsaProvider) throw new Error('No ecdsaProvider');
        console.log('Sending ');

        const transactionData = await ecdsaProvider.sendUserOperation({
          target: tokenAddress,
          value: 0n,
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
        });
        setTransactionHash(transactionData.hash);
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
