// hooks/useUserBalance.tsx
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

import { useTokenPrices } from './useTokenPrices';
import publicClient from '../constants/viemPublicClient';
import { useAccount } from '../store/SmartAccountContext';

export const useUserBalance = () => {
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [fiatBalance, setFiatBalance] = useState<number>(0);
  const [isFetchingBalance, setIsFetchingBalance] = useState<boolean>(false);
  const [errorFetchingBalance, setErrorFetchingBalance] = useState<string | null>(null);
  const { address } = useAccount();
  const { tokenPrices, isLoading } = useTokenPrices();
  const ethMXPrice = tokenPrices?.ethereum.mxn || 0;

  const fetchBalance = async () => {
    setIsFetchingBalance(true);
    try {
      if (address) {
        const balance = await publicClient.getBalance({
          address,
        });
        const formattedBalance = Number(formatEther(balance));
        setTokenBalance(formattedBalance);
        setFiatBalance(formattedBalance * ethMXPrice);
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
