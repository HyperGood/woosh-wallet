import firestore from '@react-native-firebase/firestore';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, ActivityIndicator, SafeAreaView, View, StyleSheet } from 'react-native';
import Button from '../../components/UI/Button';
import { COLORS } from '../../constants/global-styles';
import BackButton from '../../components/UI/BackButton';

export default function Page() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<any>(null);

  //Use a useEffect to fetch the data from Firestore
  useEffect(() => {
    (async () => {
      const txId = Array.isArray(id) ? id[0] : id;
      const transactionData = await firestore().collection('transactions').doc(txId).get();
      if (!transactionData.exists) {
        console.log('No such document!');
        setIsLoading(false);
      } else {
        setTransactionData(transactionData.data());
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
        <BackButton />

        <Text style={styles.title}>{transactionData.sender} sent you</Text>
        <Text style={styles.title}>
          {transactionData.amount} {transactionData.token}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Button title="Claim" onPress={() => {}} type="primary" />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.dark,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
    marginHorizontal: 32,
    marginBottom: 16,
  },
});
