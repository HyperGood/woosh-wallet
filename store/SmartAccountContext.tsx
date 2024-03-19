import { KernelSmartAccount, type KernelAccountClient } from '@zerodev/sdk';
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
  kernelClient: KernelAccountClient | null;
  setKernelClient: Dispatch<SetStateAction<KernelAccountClient | null>>;
  account: KernelSmartAccount | null;
  setAccount: Dispatch<SetStateAction<KernelSmartAccount | null>>;
  address: `0x${string}` | null;
}

export const SmartAccountContext = createContext<SmartAccountContextType>({
  kernelClient: null,
  setKernelClient: () => {},
  account: null,
  setAccount: () => {},
  address: null,
});

export function useSmartAccount() {
  const value = useContext(SmartAccountContext);
  return value;
}

interface SmartAccountProviderProps {
  children: ReactNode;
}

function SmartAccountProvider({ children }: SmartAccountProviderProps) {
  const [kernelClient, setKernelClient] = useState<KernelAccountClient | null>(null);
  const [account, setAccount] = useState<KernelSmartAccount | null>(null);
  const [address, setAddress] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    (async () => {
      if (!kernelClient) return;
      const address = await kernelClient.account?.address;
      setAddress(address || '0x no address found');
    })();
  }, [kernelClient]);

  const value = {
    kernelClient,
    setKernelClient,
    account,
    setAccount,
    address,
  };

  return <SmartAccountContext.Provider value={value}>{children}</SmartAccountContext.Provider>;
}

export default SmartAccountProvider;
