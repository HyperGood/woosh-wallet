import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import QRIcon from '../../assets/images/icons/QRIcon';

import React, { Key, useState, useEffect, useCallback, useRef } from 'react';
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import Button from '../../components/UI/Button';

import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;

const ShowQR = ({}) => {
  const transactionDetailsRef = useRef<BottomSheetRefProps>(null);
  const isActionTrayOpened = useSharedValue(false);
  const [amountMXN, setAmountMXN] = useState('500');
  const [amountUSDc, setAmountUSDc] = useState('25.50');

  const close = useCallback(() => {
    transactionDetailsRef.current?.close();
    isActionTrayOpened.value = false;
  }, []);

  const toggleActionTray = useCallback(() => {
    const isActive = transactionDetailsRef.current?.isActive() ?? false;
    isActionTrayOpened.value = !isActive;
    isActive ? close() : transactionDetailsRef.current?.open();
  }, [close, isActionTrayOpened]);

  function createWallet() {
    console.log('Creating wallet Wallet');
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <View style={styles.container}>
          <View
            style={{
              alignSelf: 'flex-start',
              paddingTop: 44,
              paddingLeft: 16,
            }}>
            <Pressable style={styles.backButton} onPress={() => router.push('/')}>
              <Feather name="arrow-left" size={24} color={COLORS.dark} style={{ opacity: 0.5 }} />
            </Pressable>
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 }}>
            <View style={styles.qRPlaceHolder}>
              <QRIcon color={COLORS.dark} />
            </View>
            <Text style={styles.accountName}>$account1</Text>
            {true && (
              <View>
                <Text style={{ fontSize: 17, fontFamily: 'Satoshi', textAlign: 'center' }}>
                  Requesting
                </Text>
                <Text style={styles.number}>
                  $500.
                  <Text style={styles.decimal}>
                    00 <Text style={styles.mainCurrency}>MXN</Text>{' '}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Satoshi',
                    opacity: 0.5,
                    textAlign: 'center',
                  }}>
                  26.79 USDc
                </Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              {/* <Link href="/" asChild> */}
              <Button title="Edit Amount" type="primary" onPress={toggleActionTray} />
              {/* </Link> */}
            </View>
          </View>
          <View style={styles.bottomSheetContainer}>
            <BottomSheet ref={transactionDetailsRef} colorMode="light">
              <View style={styles.transactionDetailsContainer}>
                <Text style={styles.enterAmountTitle}>Enter Amount</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'gray', opacity: 0.5 }} />
                </View>
                <View style={styles.amountData}>
                  <Text style={styles.amountNumberUp}>
                    $500.
                    <Text style={styles.amountDecimalUp}>00 MXN</Text>
                  </Text>
                  <Text style={styles.amountNumberDown}>
                    25.
                    <Text style={styles.amountDecimalDown}>50 USDc</Text>
                  </Text>
                </View>
                <Button title="Save" type="primary" onPress={() => {}} />
              </View>
            </BottomSheet>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default ShowQR;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary[400],
    width: "100%",
  },
  backButton: {
    backgroundColor: COLORS.light,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qRPlaceHolder: {
    height: 257,
    width: 257,
    backgroundColor: COLORS.light,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 32,
    fontFamily: 'Satoshi',
    fontWeight: '700',
    color: COLORS.dark,
    marginVertical: 20,
  },
  number: {
    fontSize: 64,
    fontFamily: 'FHOscar',
    marginVertical: 1,
    textAlign: 'center',
  },
  decimal: {
    fontSize: 32,
  },
  mainCurrency:{
    fontSize: 16,
    fontFamily: 'Satoshi',
  },
  buttonContainer: {
    width: 224,
    marginTop: 24,
    flexDirection: 'row',
  },//------------------------------
  bottomSheetContainer: {
    position: 'absolute',
    width: windowWidth,
    bottom: 0,
    zIndex: 9999,
  },
  transactionDetailsContainer: {
    padding: 20,
  },
  enterAmountTitle: {
    fontFamily: 'Satoshi',
    fontSize: 24,
    fontWeight: '700',
  },
  amountData: {

  },
  amountNumberUp: {
    fontSize: 74,
    fontFamily: 'FHOscar',
    color: COLORS.dark,
    textAlign: 'center',
  },
  amountDecimalUp: {
    fontSize: 44,
    fontFamily: 'FHOscar',
  },
  amountNumberDown: {
    fontSize: 74,
    fontFamily: 'FHOscar',
    color: COLORS.dark,
    textAlign: 'center',
  },
  amountDecimalDown: {
    fontSize: 44,
    fontFamily: 'FHOscar',
  },
});