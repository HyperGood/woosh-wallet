import { useEffect, useState } from 'react';

type TokenPrices = {
  // Define your TokenPrices type here
  ethereum: {
    mxn: number;
    usd: number;
  };
};

export const useTokenPrices = () => {
  const [tokensData, setTokensData] = useState<TokenPrices | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cusd-coin&vs_currencies=mxn%2Cusd'
      );
      const tokensData = (await res.json()) as TokenPrices;
      setTokensData(tokensData);
    };

    fetchData();
  }, []);

  return tokensData;
};
