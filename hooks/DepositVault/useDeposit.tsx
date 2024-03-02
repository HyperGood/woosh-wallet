/**
 * useDeposit Hook
 * 
 * A custom hook for handling deposit functionality to the DepositVault in the project.
 * It provides methods for depositing funds with signatures with "SmartAccountContext",
 * using phone authentication, for authorization and managing related
 * deposit states.
 * This handles USDc approval and transaction execution.
 * 
 * @returns An object (hook) containing methods and states for deposit handling.
 * 
 * How to use it:
 * - Import the hook.
 * - Call the hook to get access to the deposit method, deposit transaciton hash, and transaction status
 * - Use the deposit method to initiate the deposit process with a specified amount passed in a string format and using USDc token.
 * - Check the depositHash state to obtain the hash of the deposit transaction.
 * - Check the isDepositing state to determine if the deposit process is in progress (Is Depositing).
 * - Check the depositError state to get and handle any errors that occur during depositing.
 * 
 * @example
 * 
 * Methods/States declaration:
 * 
 * const { deposit, depositHash, isDepositing, depositError } = useDeposit();
 * 
 * Methods/States usage:
 * 
 * deposit('100'); // To make a deposit of 100 USDc
 * 
 * if (isDepositing) {
 *      // Content displayed while depositing
 * } else if (depositError) {
 *      // Handle error/Content displayed if an error occurs
 * } else if (depositHash) {
 *      // If the transaction is successful then the deposit hash is available, so you can use
 *      // it either as an indicator or as a response for the user.
 * }
 */
import * as Sentry from '@sentry/react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Hex, encodeFunctionData, parseUnits } from 'viem';

import { chain } from '../../constants/viemPublicClient';
import { depositVaultAbi, contractAddress, Addresses } from '../../references/depositVault-abi';
import { usdcAddress, TokenAddresses } from '../../references/tokenAddresses';
import { useAccount } from '../../store/SmartAccountContext';

export const useDeposit = () => {
  const [depositHash, setDepositHash] = useState<string | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<any>(null);
  const { ecdsaProvider } = useAccount();
  const chainId = chain.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress ? contractAddress[chainId as keyof Addresses][0] : '0x12';
  const tokenAddress = usdcAddress[chainId as keyof TokenAddresses][0];
  const tokenDecimals = 6;

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
      Sentry.captureException(e);
      Alert.alert('Transaction Failed!!');
    } finally {
      setIsDepositing(false);
    }
  };

  return { deposit, depositHash, isDepositing, depositError };
};
