import { useState } from 'react';
import { Alert } from 'react-native';
import { parseEther } from 'viem';
import { optimismGoerli } from 'viem/chains';

import publicClient from '../../constants/viemPublicClient';
import { Addresses, contractAddress } from '../../references/depositVault-abi';
import { useAccount } from '../../store/SmartAccountContext';

export const useSignDeposit = () => {
  const [signature, setSignature] = useState<string>();
  const [isSigning, setIsSigning] = useState(false);
  const [signError, setSignError] = useState<any>(null);
  const { ecdsaProvider } = useAccount();
  const chainId = optimismGoerli.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress ? contractAddress[chainId as keyof Addresses][0] : '0x12';

  async function getDepositInfo() {
    return new Promise<{ depositIndex: bigint; depositAmount: number }>((resolve, reject) => {
      const unwatch = publicClient.watchEvent({
        address: depositVaultAddress,
        event: {
          name: 'DepositMade',
          type: 'event',
          inputs: [
            { type: 'address', indexed: true, name: 'depositor' },
            { type: 'uint256', indexed: true, name: 'depositIndex' },
            { type: 'uint256', indexed: false, name: 'balance' },
            { type: 'address', indexed: false, name: 'tokenAddress' },
          ],
        },
        onLogs: (log) => {
          const depositIndex = log[0]?.args.depositIndex || BigInt(0);
          const depositAmount = Number(log[0]?.args.balance);
          console.log('DepositIndex: ', Number(depositIndex));
          console.log('Amount: ', depositAmount);
          resolve({ depositIndex, depositAmount });
        },
        onError: (error) => {
          console.log('Error: ', error);
          reject(error);
        },
      });
    });
  }

  const signDeposit = async () => {
    setIsSigning(true);
    try {
      const { depositIndex, depositAmount } = await getDepositInfo();

      const domain = {
        name: 'DepositVault',
        version: '1.0.0',
        chainId,
        verifyingContract: depositVaultAddress,
      } as const;

      const types = {
        Withdrawal: [
          { name: 'amount', type: 'uint256' },
          { name: 'depositIndex', type: 'uint256' },
        ],
      };

      const message = {
        amount: parseEther(depositAmount?.toString() || '0'),
        depositIndex,
      } as const;

      const typedData = {
        domain,
        types,
        message,
        primaryType: 'Withdrawal',
      };

      const signature = await ecdsaProvider?.signTypedData(typedData);
      setSignature(signature);
    } catch (e) {
      setSignError(e);
      console.log('Error: ', e);
      Alert.alert('Something went wrong with generating the signature!!');
    } finally {
      setIsSigning(false);
    }
  };

  return { signDeposit, signature, isSigning, signError };
};
