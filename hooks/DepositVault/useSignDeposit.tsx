import { useState } from 'react';
import { Alert } from 'react-native';
import { parseEther } from 'viem';
import { optimismSepolia } from 'viem/chains';

import publicClient from '../../constants/viemPublicClient';
import { Addresses, contractAddress } from '../../references/depositVault-abi';
import { useAccount } from '../../store/SmartAccountContext';
import { useTransaction } from '../../store/TransactionContext';

export const useSignDeposit = () => {
  const { setSignature, setTransactionData } = useTransaction();
  const [isSigning, setIsSigning] = useState(false);
  const [signError, setSignError] = useState<any>(null);
  const { ecdsaProvider } = useAccount();
  const chainId = optimismSepolia.id;
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
          unwatch();
        },
        onError: (error) => {
          console.log('Error: ', error);
          reject(error);
          unwatch();
        },
      });
    });
  }

  const signDeposit = async () => {
    setIsSigning(true);
    try {
      const { depositIndex, depositAmount } = await getDepositInfo();

      return new Promise(async (resolve, reject) => {
        setTransactionData((prevData) => {
          const updatedData = {
            ...prevData,
            depositIndex: Number(depositIndex),
          };
          // Resolve the Promise with the updated data
          resolve(updatedData);
          return updatedData;
        });

        const domain = {
          name: 'DepositVault',
          version: '1.0.0',
          chainId,
          verifyingContract: depositVaultAddress,
        } as const;
        console.log('Domain: ', domain);

        const types = {
          Withdrawal: [
            { name: 'amount', type: 'uint256' },
            { name: 'depositIndex', type: 'uint256' },
          ],
        };
        console.log('Types: ', types);

        const message = {
          amount: depositAmount || '0',
          depositIndex,
        } as const;

        console.log('Message: ', message);

        const typedData = {
          domain,
          types,
          message,
          primaryType: 'Withdrawal',
        };
        const signedDeposit = (await ecdsaProvider?.signTypedDataWith6492(typedData)) || '';
        setSignature(signedDeposit);
      });
    } catch (e) {
      setSignError(e);
      console.log('Error: ', e);
      Alert.alert('Something went wrong with generating the signature!!');
    } finally {
      setIsSigning(false);
    }
  };

  return { signDeposit, isSigning, signError };
};
