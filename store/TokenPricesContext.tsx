import { createContext, useContext, useEffect, useState } from 'react';

type TokenPrices = {
  ethereum: {
    mxn: number;
    usd: number;
  };
};

type TokenPricesContextType = {
  tokenPrices: TokenPrices | null;
  setTokenPrices: (tokenPrices: TokenPrices | null) => void;
};

export const TokenPricesContext = createContext<TokenPricesContextType>({
  tokenPrices: null,
  setTokenPrices: () => {},
});

export function useTokenPricesContext() {
  return useContext(TokenPricesContext);
}
