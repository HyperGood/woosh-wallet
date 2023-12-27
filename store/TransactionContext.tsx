import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

import { Transaction } from '../models/Transaction';

interface TransactionData extends Partial<Transaction> {
  recipient?: string;
  amount?: string;
  token?: string;
  depositIndex?: number;
  transactionHash?: string;
}

interface TransactionContextType {
  transactionData: TransactionData | null;
  setTransactionData: Dispatch<SetStateAction<TransactionData | null>>;
  signature: string;
  setSignature: Dispatch<SetStateAction<string>>;
}

const TransactionContext = createContext<TransactionContextType>({
  transactionData: null,
  setTransactionData: () => {},
  signature: '',
  setSignature: () => {},
});

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [signature, setSignature] = useState<string>('');

  const value = {
    transactionData,
    setTransactionData,
    signature,
    setSignature,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransaction = () => useContext(TransactionContext);
