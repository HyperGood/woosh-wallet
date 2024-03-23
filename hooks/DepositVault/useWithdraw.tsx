import * as Sentry from '@sentry/react-native';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { Alert } from 'react-native';
import { encodeFunctionData, isHex } from 'viem';

import { chain } from '../../constants/viemPublicClient';
import { depositVaultAbi, contractAddress, Addresses } from '../../references/depositVault-abi';
import { kernelClientAtom, smartAccountAtom } from '../../store/store';

export const useWithdraw = () => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<any>(null);
  const kernelClient = useAtomValue(kernelClientAtom);
  const account = useAtomValue(smartAccountAtom);
  const chainId = chain.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress ? contractAddress[chainId as keyof Addresses][0] : '0x12';

  const withdraw = async (depositIndex: number, secret: `0x${string}`, address: `0x${string}`) => {
    setIsWithdrawing(true);
    try {
      if (!kernelClient) throw new Error('No ecdsaProvider');
      if (!account) throw new Error('No Account');
      if (!isHex(secret)) throw new Error('Secret is not a hexadecimal string');
      console.log('Withdrawing');
      const withdrawHash = await kernelClient.sendUserOperation({
        userOperation: {
          callData:
            (await account?.encodeCallData({
              to: depositVaultAddress,
              value: BigInt(0),
              data: encodeFunctionData({
                abi: depositVaultAbi,
                functionName: 'withdraw',
                args: [BigInt(depositIndex), secret, address],
              }),
            })) ?? '0x',
        },
        account,
      });
      return withdrawHash;
    } catch (e) {
      setWithdrawError(e);
      Sentry.captureException(e);
      Alert.alert('Transaction Failed!!');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return { withdraw, isWithdrawing, withdrawError };
};
