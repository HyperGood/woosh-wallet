import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Hex, encodeFunctionData, parseUnits } from 'viem';

import { depositVaultAbi, contractAddress, Addresses } from '../../references/depositVault-abi';
import { usdcAddress, TokenAddresses } from '../../references/tokenAddresses';
import { useAccount } from '../../store/SmartAccountContext';
import { chain } from '../../constants/viemPublicClient';

export const useDeposit = () => {
  const [depositHash, setDepositHash] = useState<string | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<any>(null);
  const { ecdsaProvider } = useAccount();
  const chainId = chain.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress ? contractAddress[chainId as keyof Addresses][0] : '0x12';
  const tokenAddress = usdcAddress[chainId as keyof TokenAddresses][0];
  const tokenDecimals = process.env.EXPO_PUBLIC_TESTNET === 'true' ? 18 : 6;

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
        console.log('Sending deposit');
        const approvalData = await ecdsaProvider.sendUserOperation({
          target: tokenAddress,
          value: 0n,
          data: encodeFunctionData({
            abi: [
              {
                name: 'approve',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              },
            ],
            functionName: 'approve',
            args: [depositVaultAddress, parseUnits(amount, tokenDecimals)],
          }),
        });
        await ecdsaProvider.waitForUserOperationTransaction(approvalData.hash as Hex);
        const depositData = await ecdsaProvider.sendUserOperation({
          target: depositVaultAddress,
          value: 0n,
          data: encodeFunctionData({
            abi: depositVaultAbi,
            functionName: 'deposit',
            args: [parseUnits(amount, tokenDecimals), tokenAddress],
          }),
        });
        setDepositHash(depositData.hash);
        setIsDepositing(false);
      }
    } catch (e) {
      setDepositError(e);
      console.log(e);
      Alert.alert('Transaction Failed!!');
    } finally {
      setIsDepositing(false);
    }
  };

  return { deposit, depositHash, isDepositing, depositError };
};
