import * as Sentry from '@sentry/react-native';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fetchLastUnclaimedTransaction } from '../api/firestoreService';
import Button from '../components/UI/Button';
import { COLORS } from '../constants/global-styles';
import i18n from '../constants/i18n';
import { useAuthentication } from '../hooks/useAuthentication';

export default function Page() {
  const { authenticate, deletePrivateKey } = useAuthentication();
  const [id, setID] = useState<any>('');

  useEffect(() => {
    (async () => {
      const lastTransactionID = await fetchLastUnclaimedTransaction();
      setID(lastTransactionID);
    })();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{i18n.t('loginTitle')}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={i18n.t('loginButton')}
          onPress={async () => {
            try {
              await authenticate();

              router.replace('/');
            } catch (error) {
              console.error(error);
              Sentry.captureException(error);
            }
          }}
        />
        <Link
          href={{
            pathname: '/claim/[id]',
            params: { id: id || '' },
          }}
          asChild>
          <Button title="Go to most recent transaction" onPress={() => {}} />
        </Link>
        <Button type="destructive" onPress={deletePrivateKey} title="Delete Private Key" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.gray[400],
    justifyContent: 'center',
    padding: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  title: {
    fontSize: 48,
    color: COLORS.dark,
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: 24,
  },
});
