// hooks/useUserBalance.tsx
import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import { useTokenPrices } from './useTokenPrices';
import { storage } from '../app/_layout';
import publicClient, { chain } from '../constants/viemPublicClient';
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
  const chainId = chain.id;
  const tokenAddress =
    chainId && chainId in usdcAddress ? usdcAddress[chainId as keyof TokenAddresses][0] : '0x12';
  const tokenDecimals = 6;
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
    setIsFetchingBalance(true);
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
          storage.set('usdcPrice', usdcPrice);
        } else {
          const usdcPrice = storage.getNumber('usdcPrice');
          if (usdcPrice) {
            setFiatBalance(usdcPrice * formattedBalance);
          } else {
            throw new Error("Couldn't fetch balance and no stored balance found");
          }
        }
      } else {
        setErrorFetchingBalance("There's no address! Couldn't fetch balance");
      }
    } catch (e: any) {
      setErrorFetchingBalance(e.message);
      Sentry.captureException(e);
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
