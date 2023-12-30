import { useEffect, useState } from 'react';

type TokenPrices = {
  ethereum: {
    mxn: number;
    usd: number;
  };
};

export const useTokenPrices = () => {
  const [tokenPrices, setTokenPrices] = useState<TokenPrices | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // const response = await fetch(
        //   'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cusd-coin&vs_currencies=mxn%2Cusd'
        // );
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
        // const data = await response.json();
        const data = {
          ethereum: {
            mxn: 39636.97,
            usd: 2334.25,
          },
        };
        setTokenPrices(data as TokenPrices);
      } catch (error) {
        console.error('There has been a problem with fetching the token prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { tokenPrices, isLoading };
};
