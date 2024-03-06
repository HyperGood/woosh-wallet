// hooks/useUserBalance.tsx
import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import { useTokenPrices } from './useTokenPrices';
import { storage } from '../app/_layout';
import publicClient, { chain } from '../constants/viemPublicClient';
import { TokenAddresses, usdcAddress } from '../references/tokenAddresses';
import { useAccount } from '../store/SmartAccountContext';

interface Token {
  name: string;
  address: string;
  decimals: number;
}

interface Balance {
  usdc: number;
  ausdc: number;
}

export const useUserBalance = () => {
  const [tokenBalances, setTokenBalances] = useState<Balance>({ usdc: 0, ausdc: 0 });
  const [fiatBalances, setFiatBalances] = useState<Balance>({ usdc: 0, ausdc: 0 });
  const [isFetchingBalance, setIsFetchingBalance] = useState<boolean>(true);
  const [errorFetchingBalance, setErrorFetchingBalance] = useState<string | null>(null);
  const { address } = useAccount();
  const { tokenPrices } = useTokenPrices();
  const usdcPrice = tokenPrices?.['usd-coin'].mxn;
  const chainId = chain.id;

  const USDC: Token = {
    name: 'USDc',
    address:
      chainId && chainId in usdcAddress ? usdcAddress[chainId as keyof TokenAddresses][0] : '0x12',
    decimals: 6,
  };

  const AUSDC: Token = {
    name: 'aUSDc',
    address: '0x16da4541ad1807f4443d92d26044c1147406eb80',
    decimals: 6,
  };

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
  } as const;

  const fetchBalance = async () => {
    setIsFetchingBalance(true);
    try {
      if (address) {
        const usdcBalance = await publicClient.readContract({
          ...contract,
          address: USDC.address as `0x${string}`,
          functionName: 'balanceOf',
          args: [address],
        });
        const formattedUsdcBalance = Number(formatUnits(usdcBalance, USDC.decimals));

        const ausdcBalance = await publicClient.readContract({
          ...contract,
          address: AUSDC.address as `0x${string}`,
          functionName: 'balanceOf',
          args: [address],
        });
        const formattedAusdcBalance = Number(formatUnits(ausdcBalance, AUSDC.decimals));

        storage.set('usdcBalance', formattedUsdcBalance);
        storage.set('usdtBalance', formattedAusdcBalance);

        setTokenBalances({
          usdc: formattedUsdcBalance,
          ausdc: formattedAusdcBalance,
        });

        if (usdcPrice) {
          setFiatBalances({
            usdc: formattedUsdcBalance * usdcPrice,
            ausdc: formattedAusdcBalance * usdcPrice,
          });
          storage.set('usdcPrice', usdcPrice);
        } else {
          const storedUsdcPrice = storage.getNumber('usdcPrice');
          if (storedUsdcPrice) {
            setFiatBalances({
              usdc: formattedUsdcBalance * storedUsdcPrice,
              ausdc: formattedAusdcBalance * storedUsdcPrice,
            });
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
  }, [address, usdcPrice]);

  return {
    tokenBalances,
    fiatBalances,
    isFetchingBalance,
    errorFetchingBalance,
    refetchBalance: fetchBalance,
  };
};
