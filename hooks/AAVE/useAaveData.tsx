// src/hooks/useAaveData.ts
import { formatReserves } from '@aave/math-utils';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import { fetchContractData } from '../../constants/AaveService';
export const useAaveData = () => {
  const [usdcApy, setUsdcApy] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchContractData();
        const reservesArray = data.reserves.reservesData;
        const baseCurrencyData = data.reserves.baseCurrencyData;
        const currentTimestamp = dayjs().unix();

        const formattedPoolReserves = formatReserves({
          reserves: reservesArray,
          currentTimestamp,
          marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
          marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
        });

        // Get usdc apy
        const usdcReserve = formattedPoolReserves.find((reserve) => reserve.name === 'USDC');
        if (usdcReserve && usdcReserve.supplyAPY) {
          setUsdcApy(parseFloat(usdcReserve.supplyAPY) * 100);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return usdcApy;
};
