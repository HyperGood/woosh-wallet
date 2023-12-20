import { ECDSAProvider } from '@zerodev/sdk';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

interface SmartAccountContextType {
  ecdsaProvider: ECDSAProvider | null;
  setEcdsaProvider: Dispatch<SetStateAction<ECDSAProvider | null>>;
  fiatBalance: number;
  setFiatBalance: Dispatch<SetStateAction<number>>;
  tokenBalance: number;
  setTokenBalance: Dispatch<SetStateAction<number>>;
}

export const SmartAccountContext = createContext<SmartAccountContextType>({
  ecdsaProvider: null,
  setEcdsaProvider: () => {},
  fiatBalance: 0,
  setFiatBalance: () => {},
  tokenBalance: 0,
  setTokenBalance: () => {},
});

export function useAccount() {
  const value = useContext(SmartAccountContext);
  return value;
}

interface SmartAccountProviderProps {
  children: ReactNode;
}

function SmartAccountProvider({ children }: SmartAccountProviderProps) {
  const [ecdsaProvider, setEcdsaProvider] = useState<ECDSAProvider | null>(null);
  const [fiatBalance, setFiatBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  const value = {
    ecdsaProvider,
    setEcdsaProvider,
    fiatBalance,
    setFiatBalance,
    tokenBalance,
    setTokenBalance,
  };

  return <SmartAccountContext.Provider value={value}>{children}</SmartAccountContext.Provider>;
}

export default SmartAccountProvider;
