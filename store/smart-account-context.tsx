import { ECDSAProvider } from '@zerodev/sdk';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

interface SmartAccountContextType {
  ecdsaProvider: ECDSAProvider | null;
  setEcdsaProvider: Dispatch<SetStateAction<ECDSAProvider | null>>;
}

export const SmartAccountContext = createContext<SmartAccountContextType>({
  ecdsaProvider: null,
  setEcdsaProvider: () => {},
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
  const value = {
    ecdsaProvider,
    setEcdsaProvider,
  };

  return <SmartAccountContext.Provider value={value}>{children}</SmartAccountContext.Provider>;
}

export default SmartAccountProvider;
