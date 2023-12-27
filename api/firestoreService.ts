import firestore from '@react-native-firebase/firestore';

import { Transaction } from '../models/Transaction';

export const fetchTransactions = async (): Promise<Partial<Transaction>[]> => {
  try {
    const transactions = await firestore()
      .collection('transactions')
      .orderBy('createdAt', 'desc')
      .get();
    return transactions.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Partial<Transaction>[];
  } catch (error) {
    console.error('Error fetching transactions: ', error);
    return [];
  }
};
