import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface Contact {
  phoneNumber: string;
  name: string;
  amount: number;
}

interface RequestData {
  recipientAddress: string;
  totalAmount: number;
  description: string;
  type: 'total' | 'partial';
  contacts: Contact[];
}

interface RequestContextType {
  requestData: RequestData | null;
  setRequestData: Dispatch<SetStateAction<RequestData | null>>;
}

const RequestContext = createContext<RequestContextType>({
  requestData: null,
  setRequestData: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const RequestProvider = ({ children }: ProviderProps) => {
  const [requestData, setRequestData] = useState<RequestData | null>(null);

  const value = {
    requestData,
    setRequestData,
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};

export const useRequest = () => useContext(RequestContext);
