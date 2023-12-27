import firestore from '@react-native-firebase/firestore';

export const fetchTransactions = async () => {
  try {
    const transactions = await firestore()
      .collection('transactions')
      .orderBy('createdAt', 'desc')
      .get();
    return transactions.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching transactions: ', error);
  }
};
