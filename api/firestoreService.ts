import firestore from '@react-native-firebase/firestore';

import { Transaction } from '../models/Transaction';
import { User } from '../models/User';

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

export const fetchUserByEthAddress = async (ethAddress: string): Promise<Partial<User> | null> => {
  try {
    const user = await firestore().collection('users').where('ethAddress', '==', ethAddress).get();
    if (!user.empty) {
      const doc = user.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Partial<User>;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user by ethAddress: ', error);
    return null;
  }
};
