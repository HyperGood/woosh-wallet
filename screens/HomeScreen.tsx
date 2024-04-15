import { Link, useFocusEffect } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Skeleton } from 'moti/skeleton';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//0xPass
import { TESTNET_RSA_PUBLIC_KEY } from '@0xpass/passport';
import { createPassportClient } from '@0xpass/passport-viem';
import { mainnet } from 'viem/chains';

import { fetchTransactionsByEthAddress } from '../api/firestoreService';
import Balance from '../components/Balance';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import BottomSheet, { BottomSheetRefProps } from '../components/modals/BottomSheet';
import PreviousTransactions from '../components/transactions/UI/PreviousTransactions';
import TransactionInformation from '../components/transactions/UI/TransactionInformation';
import { COLORS } from '../constants/global-styles';
import i18n from '../constants/i18n';
import { useToggleBottomSheet } from '../hooks/BottomSheet/useToggleBottomSheet';
import { Transaction } from '../models/Transaction';
import { userAddressAtom } from '../store/store';
import { scale } from '../utils/scalingFunctions';
import { usePassport } from '../hooks/0xPass/usePassport';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const address = useAtomValue(userAddressAtom);
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [transactionInfo, setTransactionInfo] = useState<Transaction>();
  const transactionDetailsRefs = useRef<BottomSheetRefProps>(null);
  const isActionTrayOpened = useSharedValue(false);

  const close = useCallback(() => {
    transactionDetailsRefs.current?.close();
    isActionTrayOpened.value = false;
  }, []);

  const toggleBottomSheet = useToggleBottomSheet(transactionDetailsRefs, isActionTrayOpened, close);

  useFocusEffect(
    useCallback(() => {
      if (!address) {
        console.log('No address found');
        return;
      }
      (async () => {
        const transactions = await fetchTransactionsByEthAddress(address);
        setTransactions(transactions);
      })();
    }, [address])
  );

  //0xPass
  const [username, setUsername] = useState('roy');
  const [registering, setRegistering] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticateSetup, setAuthenticateSetup] = useState(false);
  const [authenticatedHeader, setAuthenticatedHeader] = useState({});
  const [passportAddress, setPassportAddress] = useState('');
  const [messageSignature, setMessageSignature] = useState('');
  const [signMessageLoading, setSignMessageLoading] = useState(false);

  const userInput = {
    username,
    userDisplayName: username,
  };

  const { passport } = usePassport({
    ENCLAVE_PUBLIC_KEY: TESTNET_RSA_PUBLIC_KEY,
    scope_id: '07907e39-63c6-4b0b-bca8-377d26445172',
  });

  async function register() {
    setRegistering(true);
    try {
      console.log('Registering...');
      await passport.setupEncryption();
      console.log('Encryption setup');
      const res = await passport.register(userInput);
      console.log(res);

      if (res.result.account_id) {
        setRegistering(false);
        setAuthenticating(true);
        await authenticate();
        setAuthenticating(false);
      }
    } catch (error) {
      console.error('Error registering:', error);
    } finally {
      setRegistering(false);
      setAuthenticating(false);
    }
  }

  async function authenticate() {
    setAuthenticating(true);
    try {
      await passport.setupEncryption();
      const [authenticatedHeader, address] = await passport.authenticate(userInput);
      setAuthenticatedHeader(authenticatedHeader);
      console.log(address);
      setPassportAddress(address);
      setAuthenticated(true);
    } catch (error) {
      console.error('Error authenticating:', error);
    } finally {
      setAuthenticating(false);
    }
  }

  function createWalletClient() {
    return createPassportClient(authenticatedHeader, fallbackProvider, mainnet);
  }

  async function signMessage(message: string) {
    try {
      setSignMessageLoading(true);
      const client = createWalletClient();
      const response = await client.signMessage({
        account: '0x00',
        message,
      });
      setMessageSignature(response);
      setSignMessageLoading(false);
    } catch (error) {
      console.error('Error signing message:', error);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingTop: insets.top }}
          showsVerticalScrollIndicator={false}>
          <Header />
          <Balance />
          <Text>Passport Address: {passportAddress}</Text>
          <Skeleton show={!transactions} height={120} width="100%">
            <View style={styles.buttonsContainer}>
              {/* <Link href="/(tabs)/(home)/request/enterAmount" asChild> */}
              <Button
                // title={i18n.t('request')}
                title="Register on 0xPass"
                icon="arrow-down-left"
                type="secondary"
                swapIcon
                onPress={async () => {
                  if (authenticateSetup) {
                    await authenticate();
                  } else {
                    await register();
                  }
                }}
              />
              {/* </Link> */}
              <Link href="/(tabs)/(home)/send/recipient" asChild>
                <Button title={i18n.t('send')} icon="send" type="primary" onPress={() => {}} />
              </Link>
            </View>
          </Skeleton>
          <Skeleton show={!transactions} height={600} width="100%">
            <PreviousTransactions
              transactions={transactions}
              toggleActionTray={toggleBottomSheet}
              setTransactionInfo={setTransactionInfo}
            />
          </Skeleton>
        </ScrollView>
      </View>
      <View style={styles.bottomSheetContainer}>
        <BottomSheet ref={transactionDetailsRefs} colorMode="light">
          <TransactionInformation transaction={transactionInfo} />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.primary[400],
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: scale(48),
    paddingHorizontal: 12,
  },
  bottomSheetContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 9999,
  },
});
