import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import QRIcon from '../../assets/images/icons/QRIcon';
import { useTokenPrices } from '../../hooks/useTokenPrices';

import React, { Key, useState, useEffect, useCallback, useRef } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Button from '../../components/UI/Button';

import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;

const ShowQR = ({}) => {
  const changeAmountRef = useRef<BottomSheetRefProps>(null);
  const isActionTrayOpened = useSharedValue(false);
  const [amountMXN, setAmountMXN] = useState('0.00');
  const [amountUSDc, setAmountUSDc] = useState('0.00');
  const [usingMXN, setUsingMXN] = useState(true);
  const { tokenPrices } = useTokenPrices();
  const usdcPrice = tokenPrices?.['usd-coin'].mxn;

  const close = useCallback(() => {
    changeAmountRef.current?.close();
    isActionTrayOpened.value = false;
  }, []);

  const toggleActionTray = useCallback(() => {
    const isActive = changeAmountRef.current?.isActive() ?? false;
    isActionTrayOpened.value = !isActive;
    isActive ? close() : changeAmountRef.current?.open();
  }, [close, isActionTrayOpened]);

  const handleSave = () => {
    close();
  };

  const handleAmountChange = (value: string) => {
    value = value.replace(/[^0-9.]/g, '');
    if (value === '') {
      value = '0';
    }
    if ((amountUSDc === '0' || amountMXN === '0') && value !== '0') {
      value = value.replace(/^0+/, '');
    }
    const decimalCount = value.split('.').length - 1;
    if (decimalCount > 1) {
      const parts = value.split('.');
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (!usdcPrice) {
      throw new Error("Couldn't fetch balance and no stored balance found");
    }
    if (usingMXN) {
      setAmountMXN(value);
      const amountUSDc = (parseFloat(value) / usdcPrice).toFixed(6);
      setAmountUSDc(amountUSDc);
    } else {
      setAmountUSDc(value);
      const amountMXN = (parseFloat(value) * usdcPrice).toFixed(2);
      setAmountMXN(amountMXN);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <View style={styles.container}>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 }}>
            <View style={styles.qRPlaceHolder}>
              <QRIcon color={COLORS.dark} />
            </View>
            <Text style={styles.accountName}>$account1</Text>
            {parseFloat(amountMXN) !== 0 && (
              <View>
                <Text style={{ fontSize: 17, fontFamily: 'Satoshi', textAlign: 'center' }}>
                  Requesting
                </Text>
                <Text style={styles.number}>
                  ${amountMXN.split('.')[0]}.
                  <Text style={styles.decimal}>
                    {amountMXN.split('.')[1] ? amountMXN.split('.')[1].padEnd(2, '0') : '00'}
                    <Text style={styles.mainCurrency}>MXN</Text>
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Satoshi',
                    opacity: 0.5,
                    textAlign: 'center',
                  }}>
                  {parseFloat(amountUSDc).toFixed(2)} USDc
                </Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              {/* <Link href="/" asChild> */}
              <Button
                title={parseFloat(amountMXN) !== 0 ? 'Edit Amount' : 'Enter an Amount'}
                type="primary"
                onPress={toggleActionTray}
              />
              {/* </Link> */}
            </View>
          </View>
          <View style={styles.bottomSheetContainer}>
            <BottomSheet ref={changeAmountRef} colorMode="light">
              <View style={styles.changeAmountContainer}>
                <Text style={styles.enterAmountTitle}>Enter Amount</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'gray', opacity: 0.5 }} />
                </View>
                <View style={styles.amountData}>
                  <View style={styles.amountNumberUpContainer}>
                    <Text style={styles.amountNumberUp}>$</Text>
                    <TextInput
                      style={styles.amountNumberUp}
                      onChangeText={handleAmountChange}
                      value={usingMXN ? amountMXN : amountUSDc}
                      keyboardType="numeric"
                    />
                    <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                      {usingMXN ? ' MXN' : ' USDc'}
                    </Text>
                  </View>
                  <Pressable onPress={() => setUsingMXN(!usingMXN)}>
                    <Text style={styles.amountNumberDown}>
                      {usingMXN ? amountUSDc + ' USDc' : amountMXN + ' MXN'}
                    </Text>
                  </Pressable>
                </View>
                <Button title="Save" type="primary" onPress={handleSave} />
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
    width: '100%',
    paddingTop: 150,
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
  mainCurrency: {
    fontSize: 16,
    fontFamily: 'Satoshi',
  },
  buttonContainer: {
    width: 224,
    marginTop: 24,
    flexDirection: 'row',
  }, //------------------------------
  bottomSheetContainer: {
    position: 'absolute',
    width: windowWidth,
    bottom: 0,
    zIndex: 9999,
  },
  changeAmountContainer: {
    padding: 20,
  },
  enterAmountTitle: {
    fontFamily: 'Satoshi',
    fontSize: 24,
    fontWeight: '700',
  },
  amountData: {
    width: '100%',
    marginVertical: 60,
  },
  amountNumberUpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountNumberUp: {
    fontSize: 64,
    fontFamily: 'FHOscar',
    color: COLORS.dark,
    textAlign: 'center',
  },
  amountNumberDown: {
    fontSize: 17,
    fontFamily: 'FHOscar',
    color: COLORS.dark,
    textAlign: 'center',
  },
});
