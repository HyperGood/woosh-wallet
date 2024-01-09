import { useState } from 'react';
import { Alert } from 'react-native';
import { encodeFunctionData, isHex } from 'viem';
import { optimismSepolia } from 'viem/chains';

import { depositVaultAbi, contractAddress, Addresses } from '../../references/depositVault-abi';
import { useAccount } from '../../store/SmartAccountContext';

export const useWithdraw = () => {
  const [withdrawHash, setWithdrawHash] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<any>(null);
  const { ecdsaProvider } = useAccount();
  const chainId = optimismSepolia.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress ? contractAddress[chainId as keyof Addresses][0] : '0x12';

  const withdraw = async (depositIndex: number, secret: `0x${string}`, address: `0x${string}`) => {
    setIsWithdrawing(true);
    try {
      if (!ecdsaProvider) throw new Error('No ecdsaProvider');
      if (!isHex(secret)) throw new Error('Secret is not a hexadecimal string');
      console.log('Withdrawing');
      const { hash, request } = await ecdsaProvider.sendUserOperation({
        target: depositVaultAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: depositVaultAbi,
          functionName: 'withdraw',
          args: [BigInt(depositIndex), secret, address],
        }),
      });
      console.log('Withdraw request: ', request);
      console.log('Withdraw hash: ', hash);
      setWithdrawHash(hash);
      Alert.alert('Transaction Successful!! User Op Hash: ', hash);
      setIsWithdrawing(false);
    } catch (e) {
      setWithdrawError(e);
      Alert.alert('Transaction Failed!!');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return { withdraw, withdrawHash, isWithdrawing, withdrawError };
};
