// hooks/useUserBalance.tsx
import firestore from '@react-native-firebase/firestore';
import * as Sentry from '@sentry/react-native';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import { useTokenPrices } from '../api/queries';
import { storage } from '../app/_layout';
import publicClient, { chain } from '../constants/viemPublicClient';
import {
  AUSDCTokenAddresses,
  USDCTokenAddresses,
  aUSDcAddress,
  usdcAddress,
} from '../references/tokenAddresses';
import { fiatBalanceAtom, totalBalanceAtom, userAddressAtom } from '../store/store';

interface Token {
  name: string;
  address: string;
  decimals: number;
}

interface Balance {
  usdc: number;
  ausdc: number;
}

interface BalanceUpdateData {
  ausdcBalance: number;
  usdcBalance: number;
  lastUpdated: Date;
  user: any;
  yield?: {
    allTime: number;
  };
  createdAt?: Date;
}

export const useUserBalance = () => {
  const [tokenBalances, setTokenBalances] = useState<Balance>({ usdc: 0, ausdc: 0 });
  const [isFetchingBalance, setIsFetchingBalance] = useState<boolean>(true);
  const [errorFetchingBalance, setErrorFetchingBalance] = useState<string | null>(null);
  const address = useAtomValue(userAddressAtom);
  const chainId = chain.id;
  const [totalBalance, setTotalBalance] = useAtom(totalBalanceAtom);
  const [, setFiatBalance] = useAtom(fiatBalanceAtom);
  const tokenPricesQuery = useTokenPrices();
  const usdcPrice = tokenPricesQuery.data?.['usd-coin'].mxn || 1;

  const USDC: Token = {
    name: 'USDc',
    address:
      chainId && chainId in usdcAddress
        ? usdcAddress[chainId as keyof USDCTokenAddresses][0]
        : '0x12',
    decimals: 6,
  };

  const AUSDC: Token = {
    name: 'aUSDc',
    address:
      chainId && chainId in aUSDcAddress
        ? aUSDcAddress[chainId as keyof AUSDCTokenAddresses][0]
        : '0x12',
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

  const saveBalanceToFirestore = async (
    address: string,
    ausdcBalance: number,
    usdcBalance: number
  ) => {
    const userBalanceRef = firestore().collection('userBalances').doc(address);
    const userBalanceSnapshot = await userBalanceRef.get();

    let allTimeYield = 0;
    let documentDataToUpdate: BalanceUpdateData = {
      ausdcBalance,
      usdcBalance,
      lastUpdated: new Date(),
      user: firestore().doc(`users/${address}`),
    };

    if (userBalanceSnapshot.exists) {
      const balanceData = userBalanceSnapshot.data();
      console.log('balanceData', balanceData);
      allTimeYield = balanceData?.yield?.allTime || 0;

      let yieldGenerated;
      if (userBalanceSnapshot.data()?.ausdcBalance)
        yieldGenerated = ausdcBalance - userBalanceSnapshot.data()?.ausdcBalance;
      else yieldGenerated = 0;

      documentDataToUpdate.yield = {
        allTime: allTimeYield + yieldGenerated,
      };
    } else {
      documentDataToUpdate = {
        ...documentDataToUpdate,
        createdAt: new Date(),
      };
    }

    await userBalanceRef.set(documentDataToUpdate, { merge: true });
  };

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
        storage.set('ausdcBalance', formattedAusdcBalance);

        setTokenBalances({
          usdc: formattedUsdcBalance,
          ausdc: formattedAusdcBalance,
        });

        setTotalBalance(formattedUsdcBalance + formattedAusdcBalance);

        return { usdc: formattedUsdcBalance, ausdc: formattedAusdcBalance };
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
    if (totalBalance) {
      setFiatBalance(totalBalance * usdcPrice);
    }
  }, [totalBalance]);

  useEffect(() => {
    setIsFetchingBalance(true);

    if (address) {
      fetchBalance();
      publicClient.watchBlockNumber({
        onBlockNumber: async () => {
          const fetchedBalances = await fetchBalance();

          if (fetchedBalances)
            await saveBalanceToFirestore(address, fetchedBalances.ausdc, fetchedBalances.usdc);
        },
      });
    }
  }, [address]);

  return {
    tokenBalances,
    isFetchingBalance,
    errorFetchingBalance,
    fetchBalance,
  };
};
