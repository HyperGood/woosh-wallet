import { ECDSAProvider } from '@zerodev/sdk';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface SmartAccountContextType {
  ecdsaProvider: ECDSAProvider | null;
  setEcdsaProvider: Dispatch<SetStateAction<ECDSAProvider | null>>;
  address: `0x${string}` | null;
}

export const SmartAccountContext = createContext<SmartAccountContextType>({
  ecdsaProvider: null,
  setEcdsaProvider: () => {},
  address: null,
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
  const [address, setAddress] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    (async () => {
      if (!ecdsaProvider) return;
      const address = await ecdsaProvider.getAddress();
      setAddress(address);
    })();
  }, [ecdsaProvider]);

  const value = {
    ecdsaProvider,
    setEcdsaProvider,
    address,
  };

  return <SmartAccountContext.Provider value={value}>{children}</SmartAccountContext.Provider>;
}

export default SmartAccountProvider;
