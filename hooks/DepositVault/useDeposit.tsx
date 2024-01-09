import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import { Alert } from 'react-native';
import { encodeFunctionData, parseUnits, zeroAddress } from 'viem';
import { optimismSepolia } from 'viem/chains';

import { depositVaultAbi, contractAddress, Addresses } from '../../references/depositVault-abi';
import { useAccount } from '../../store/SmartAccountContext';
import { useUserBalance } from '../useUserBalance';

export const useDeposit = () => {
  const [depositHash, setDepositHash] = useState<string | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<any>(null);
  const { ecdsaProvider } = useAccount();
  const { refetchBalance } = useUserBalance();
  const chainId = optimismSepolia.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress ? contractAddress[chainId as keyof Addresses][0] : '0x12';

  const deposit = async (amount: string) => {
    setIsDepositing(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (hasHardware) {
        const authResult = await LocalAuthentication.authenticateAsync();
        if (!authResult.success) {
          Alert.alert('Authentication Failed!!');
          return;
        }
        if (!ecdsaProvider) throw new Error('No ecdsaProvider');
        const { hash } = await ecdsaProvider.sendUserOperation({
          target: depositVaultAddress,
          value: parseUnits(amount, 18),
          data: encodeFunctionData({
            abi: depositVaultAbi,
            functionName: 'deposit',
            args: [parseUnits('0', 18), zeroAddress],
          }),
        });
        setDepositHash(hash);
        //refetch balance
        setTimeout(() => {
          refetchBalance();
        }, 3000);
        Alert.alert('Transaction Successful!! User Op Hash: ', hash);
        setIsDepositing(false);
      }
    } catch (e) {
      setDepositError(e);
      Alert.alert('Transaction Failed!!');
    } finally {
      setIsDepositing(false);
    }
  };

  return { deposit, depositHash, isDepositing, depositError };
};
