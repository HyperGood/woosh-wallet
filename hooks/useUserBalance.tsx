// hooks/useUserBalance.tsx
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { optimismSepolia } from 'viem/chains';

import { useTokenPrices } from './useTokenPrices';
import { storage } from '../app/_layout';
import publicClient from '../constants/viemPublicClient';
import { TokenAddresses, usdcAddress } from '../references/tokenAddresses';
import { useAccount } from '../store/SmartAccountContext';

export const useUserBalance = () => {
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [fiatBalance, setFiatBalance] = useState<number>(0);
  const [isFetchingBalance, setIsFetchingBalance] = useState<boolean>(true);
  const [errorFetchingBalance, setErrorFetchingBalance] = useState<string | null>(null);
  const { address } = useAccount();
  const { tokenPrices } = useTokenPrices();
  const usdcPrice = tokenPrices?.['usd-coin'].mxn;
  const chainId = optimismSepolia.id;
  const tokenAddress =
    chainId && chainId in usdcAddress ? usdcAddress[chainId as keyof TokenAddresses][0] : '0x12';
  const tokenDecimals = process.env.EXPO_PUBLIC_TESTNET === 'true' ? 18 : 6;
  const contract = {
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
      {
        type: 'function',
        name: 'decimals',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint8' }],
      },
      {
        type: 'function',
        name: 'symbol',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'string' }],
      },
    ],
    address: tokenAddress,
  } as const;

  const fetchBalance = async () => {
    try {
      if (address) {
        const balance = await publicClient.readContract({
          ...contract,
          functionName: 'balanceOf',
          args: [address],
        });
        const formattedBalance = Number(formatUnits(balance, tokenDecimals));
        storage.set('balance', formattedBalance);
        setTokenBalance(formattedBalance);
        if (usdcPrice) {
          setFiatBalance(formattedBalance * usdcPrice);
          storage.set('fiatBalance', formattedBalance * usdcPrice);
        } else {
          // Retrieve the fiatBalance from MMKV
          const storedFiatBalance = storage.getNumber('fiatBalance');
          if (storedFiatBalance) {
            setFiatBalance(storedFiatBalance);
          } else {
            throw new Error("Couldn't fetch balance and no stored balance found");
          }
        }
      } else {
        setErrorFetchingBalance("There's no address! Couldn't fetch balance");
      }
    } catch (e: any) {
      setErrorFetchingBalance(e.message);
    } finally {
      setIsFetchingBalance(false);
    }
  };

  useEffect(() => {
    setIsFetchingBalance(true);
    if (address) fetchBalance();
  }, [address]);

  return {
    tokenBalance,
    fiatBalance,
    isFetchingBalance,
    errorFetchingBalance,
    refetchBalance: fetchBalance,
  };
};
