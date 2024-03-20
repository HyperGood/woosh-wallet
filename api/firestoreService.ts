import firestore from '@react-native-firebase/firestore';
import * as Sentry from '@sentry/react-native';

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
    Sentry.captureException(error);
    return [];
  }
};

export const fetchTransactionsByEthAddress = async (
  userAddress: string
): Promise<Transaction[]> => {
  try {
    const transactionsRef = firestore().collection('transactions');
    const recipientTransactions = await transactionsRef
      .where('recipientAddress', '==', userAddress)
      .orderBy('createdAt', 'desc')
      .get();
    const claimedTransactions = await transactionsRef
      .where('claimedBy', '==', userAddress)
      .orderBy('createdAt', 'desc')
      .get();
    const senderTransactions = await transactionsRef
      .where('senderAddress', '==', userAddress)
      .orderBy('createdAt', 'desc')
      .get();

    const allTransactions = [
      ...recipientTransactions.docs,
      ...claimedTransactions.docs,
      ...senderTransactions.docs,
    ];

    return allTransactions.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Transaction[];
  } catch (error) {
    console.error('Error fetching transactions: ', error);
    Sentry.captureException(error);
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
    Sentry.captureException(error);
    return null;
  }
};

export const fetchUsersByField = async (field: string, input: string) => {
  const querySnapshot = await firestore()
    .collection('users')
    .where(field, '>=', input)
    .where(field, '<=', input + '\uf8ff')
    .get();
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
