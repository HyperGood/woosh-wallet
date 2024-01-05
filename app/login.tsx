import firestore from '@react-native-firebase/firestore';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../components/UI/Button';
import { COLORS } from '../constants/global-styles';
import { useSession } from '../store/AuthContext';

export default function Page() {
  const { authenticate } = useSession();
  const [id, setID] = useState<any>('');

  useEffect(() => {
    //Get the last transaction from firestore
    (async () => {
      const lastTransaction = await firestore()
        .collection('transactions')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
      const id = lastTransaction.docs[0].id;
      setID(id);
    })();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>La manera mas facil de pagarle a tus amigos</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar sesion"
          onPress={async () => {
            try {
              await authenticate();
              router.replace('/');
            } catch (error) {
              console.error(error);
              // Handle error
            }
          }}
        />
        {/* <Link
          href={{
            pathname: '/claim/[id]',
            params: { id: id || '' },
          }}
          asChild>
          <Button title="Go to most recent transaction" onPress={() => {}} />
        </Link> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
    justifyContent: 'center',
    padding: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: 24,
  },
});
