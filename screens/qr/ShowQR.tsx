import React, { useState, useEffect, useCallback, useRef, Dispatch, SetStateAction } from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import QRCode from 'react-qr-code';
import { BlurView } from 'expo-blur';
import { Skeleton } from 'moti/skeleton';

import { COLORS, SkeletonCommonProps } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useSmartAccount } from '../../store/SmartAccountContext';
import { useUserData } from '../../store/UserDataContext';
import Button from '../../components/UI/Button';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import { useTokenPrices } from '../../api/queries';

const windowWidth = Dimensions.get('window').width;

interface IProps {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: Dispatch<SetStateAction<boolean>>;
}

const ShowQR = ({ isBottomSheetOpen, setIsBottomSheetOpen }: IProps) => {
  const changeAmountRef = useRef<BottomSheetRefProps>(null);
  const isActionTrayOpened = useSharedValue(false);
  const { userData, isFetchingUserData } = useUserData();
  const { address } = useSmartAccount();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [amountMXN, setAmountMXN] = useState('0.00');
  const [amountUSDc, setAmountUSDc] = useState('0.00');
  const [usingMXN, setUsingMXN] = useState(true);
  const tokenPricesQuery = useTokenPrices();
  const usdcPrice = tokenPricesQuery.data?.['usd-coin'].mxn;

  useEffect(() => {
    setIsLoading(isFetchingUserData);
  }, [isFetchingUserData]);

  useEffect(() => {
    if (userData || address) {
      const truncatedAddress = address?.slice(0, 4) + '...' + address?.slice(-4);
      setUsername(userData?.username || truncatedAddress);
    }
  }, [userData, address]);

  const close = useCallback(() => {
    changeAmountRef.current?.close();
    isActionTrayOpened.value = false;
    setIsBottomSheetOpen(false);
  }, []);

  const toggleActionTray = useCallback(() => {
    const isActive = changeAmountRef.current?.isActive() ?? false;
    isActionTrayOpened.value = !isActive;
    isActive ? close() : changeAmountRef.current?.open();
    setIsBottomSheetOpen(!isActive);
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
      const amountUSDc = (parseFloat(value) / usdcPrice).toFixed(2);
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
          {isBottomSheetOpen && (
            <BlurView style={styles.blurBackground} intensity={20} tint="dark" />
          )}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.qRPlaceHolder}>
              <QRCode
                value={JSON.stringify({
                  address: address,
                  amountInMXN: new Number(amountMXN),
                  amountInUSDc: new Number(amountUSDc),
                })}
              />
            </View>
            {isLoading ? (
              <Skeleton
                height={90}
                width={windowWidth}
                radius={10}
                {...SkeletonCommonProps}></Skeleton>
            ) : (
              <Text
                style={[
                  styles.accountName,
                  parseFloat(amountMXN) !== 0 ? { fontSize: 24 } : { fontSize: 32 },
                ]}>
                {username}
              </Text>
            )}
            {parseFloat(amountMXN) !== 0 && (
              <View>
                <Text style={{ fontSize: 17, fontFamily: 'Satoshi', textAlign: 'center' }}>
                  {i18n.t('requesting')}
                </Text>
                <Text style={styles.number}>
                  ${amountMXN.split('.')[0]}.
                  <Text style={styles.decimal}>
                    {amountMXN.split('.')[1] ? amountMXN.split('.')[1].padEnd(2, '0') : '00'}
                    <Text style={styles.mainCurrency}> MXN</Text>
                  </Text>
                </Text>
                <Text style={styles.tokenAmount}>{parseFloat(amountUSDc).toFixed(2)} USDc</Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <Button
                title={parseFloat(amountMXN) !== 0 ? i18n.t('editAmount') : i18n.t('enterAnAmount')}
                type="primary"
                onPress={toggleActionTray}
              />
            </View>
          </View>
          <View style={styles.bottomSheetContainer}>
            <BottomSheet ref={changeAmountRef} colorMode="light">
              <View style={styles.changeAmountContainer}>
                <Text style={styles.enterAmountTitle}>{i18n.t('enterAmount')}</Text>
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
                      keyboardType="number-pad"
                      selectTextOnFocus={true}
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
                <Button title={i18n.t('save')} type="primary" onPress={handleSave} />
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
    textAlign: 'center',
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
  tokenAmount: {
    fontSize: 17,
    fontFamily: 'Satoshi',
    opacity: 0.5,
    textAlign: 'center',
  },
  buttonContainer: {
    width: 230,
    marginTop: 24,
    flexDirection: 'row',
  },
  bottomSheetContainer: {
    position: 'absolute',
    width: windowWidth,
    bottom: 0,
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
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});
