// hooks/useUserBalance.tsx
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

import { useTokenPrices } from './useTokenPrices';
import { storage } from '../app/_layout';
import publicClient from '../constants/viemPublicClient';
import { useAccount } from '../store/SmartAccountContext';

export const useUserBalance = () => {
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [fiatBalance, setFiatBalance] = useState<number>(0);
  const [isFetchingBalance, setIsFetchingBalance] = useState<boolean>(true);
  const [errorFetchingBalance, setErrorFetchingBalance] = useState<string | null>(null);
  const { address } = useAccount();
  const { tokenPrices } = useTokenPrices();
  const ethMXPrice = tokenPrices?.ethereum.mxn;

  const fetchBalance = async () => {
    try {
      if (address) {
        const balance = await publicClient.getBalance({
          address,
        });
        const formattedBalance = Number(formatEther(balance));
        storage.set('balance', formattedBalance);
        setTokenBalance(formattedBalance);
        if (ethMXPrice) {
          setFiatBalance(formattedBalance * ethMXPrice);
          storage.set('fiatBalance', formattedBalance * ethMXPrice);
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
