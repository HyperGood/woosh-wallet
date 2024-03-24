import { CameraView, useCameraPermissions } from 'expo-camera/next';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Button from '../../components/UI/Button';
import i18n from '../../constants/i18n';
import { useSendUSDc } from '../../hooks/Transactions/useSendUSDc';
import LoadingIndicator from '../../components/UI/LoadingSpinner';
import { COLORS } from '../../constants/global-styles';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';

interface IProps {
  disableNav: Dispatch<SetStateAction<boolean>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const ScanQR = ({ disableNav, step, setStep }: IProps) => {
  const transactionReceiptRef = useRef<BottomSheetRefProps>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [showAlert, setShowAlert] = useState(false);
  const [amountMXN, setAmountMXN] = useState('0.00');
  const [amountUSDc, setAmountUSDc] = useState('0.00');
  const { sendUSDc, transactionHash } = useSendUSDc();
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  useEffect(() => {
    if (transactionHash) setStep(2);
  }, [transactionHash]);

  useEffect(() => {
    if (step === 2) {
      transactionReceiptRef.current?.open();
    }
  }, [step]);

  if (!permission || !permission.granted) {
    return (
      <>
        <Text>You do not have permission to access the camera.</Text>
        <Button title="Request Permission" onPress={requestPermission} />
      </>
    );
  }

  const handleBarcodeScanned = async ({ type = 'qr', data }: { type: string; data: string }) => {
    if (!scanned) {
      setScanned(true);
      // parse the data
      const transactionData = JSON.parse(data);
      console.log('transactionData', transactionData);

      // Function to reset scanned state and optionally show alert
      const resetScannedState = (showAlert: boolean = false, logMessage: string) => {
        console.log(logMessage);
        if (showAlert) setShowAlert(true);
        setTimeout(() => {
          setScanned(false);
        }, 2000);
      };

      if (transactionData.address && transactionData.amountInUSDc) {
        try {
          setStep(1);
          disableNav(true);
          LocalAuthentication.authenticateAsync().then((result) => {
            if (result.success) {
              //If authenticated and QR data exists then:
              //Send the value to the address
              //sendUSDc(transactionData.amountInUSDc.toString(), transactionData.address);
              setAmountMXN(transactionData.amountInMXN.toFixed(2));
              setAmountUSDc(transactionData.amountInUSDc.toFixed(2));
              resetScannedState(false, 'sending');
            } else {
              setStep(0);
              disableNav(false);
              resetScannedState(true, 'authentication failed');
            }
          });
        } catch (error) {
          console.error(error);
          //Sentry.captureException(error);
        }
      } else if (transactionData.address) {
        // alert the user that there's no value
        resetScannedState(true, 'no value');
      } else {
        // alert the user that the address is invalid
        resetScannedState(true, 'invalid address');
      }
    }
  };

  const getCurrentDate = (): string => {
    const currentDate = new Date();

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

    return formattedDate;
  };

  return (
    <>
      {step === 0 && isFocused && (
        <View
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
          }}>
          <CameraView
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
              interval: 2000,
            }}
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
          />
        </View>
      )}
      {step === 1 && (
        <View style={[styles.contentContainer, { backgroundColor: COLORS.light }]}>
          <LoadingIndicator />
          <Text style={{ fontSize: 17, fontFamily: 'Satoshi', marginTop: 16 }}>
            Waiting For Confirmation
          </Text>
          <Pressable style={styles.BOTONPROVISIONAL} onPress={() => setStep(2)}>
            <Text style={styles.buttonText}>Next step</Text>
          </Pressable>
        </View>
      )}
      {step === 2 && (
        <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
          <SafeAreaView style={{ flex: 1, width: '100%' }}>
            <View style={[styles.contentContainer, { backgroundColor: COLORS.primary[400] }]}>
              <Text>Success!! You can close this screen</Text>
              <Pressable
                style={styles.BOTONPROVISIONAL}
                onPress={() => transactionReceiptRef.current?.open()}>
                <Text style={styles.buttonText}>Open Receipt</Text>
              </Pressable>
              <BottomSheet ref={transactionReceiptRef} colorMode="light">
                <View style={{ padding: 20, marginTop: 25, marginBottom: 140 }}>
                  <Text style={styles.informationText}>{getCurrentDate()}</Text>
                  <Text style={styles.informationText}>Tepic, Nayarit</Text>
                  <Text style={[styles.informationText, { opacity: 1, marginTop: 28 }]}>
                    {i18n.t('purchaseIn')}
                  </Text>
                  <View style={{ flexDirection: 'row', marginVertical: 12 }}>
                    <View style={{ justifyContent: 'center', paddingHorizontal: 3 }}>
                      <Image
                        source={require('../../components/transactions/UI/temp/lilly.jpg')}
                        style={styles.transactionPurImage}
                      />
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.purchaseInName}>Don Jorge Restaurante</Text>
                      </View>
                      <Text style={[{ marginVertical: 1 }, styles.informationText]}>
                        Restaurants
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.totalAmount}>
                    ${amountMXN.toString().split('.')[0]}.
                    <Text style={{ fontSize: 22 }}>
                      {amountMXN.toString().split('.')[1].padEnd(2, '0')} MXN
                    </Text>
                  </Text>
                  <Text style={styles.informationText}>{amountUSDc} USDc</Text>
                </View>
              </BottomSheet>
            </View>
          </SafeAreaView>
        </GestureHandlerRootView>
      )}
    </>
  );
};
export default ScanQR;
const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContainer: {
    backgroundColor: '#FFEA9F',
    position: 'absolute',
    width: 270,
    height: 52,
    justifyContent: 'center',
    borderRadius: 10,
  },
  alertText: {
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Satoshi',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  informationText: {
    fontFamily: 'Satoshi',
    fontSize: 17,
    letterSpacing: -0.02,
    color: COLORS.dark,
    opacity: 0.6,
    marginVertical: 4,
  },
  transactionPurImage: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: COLORS.light,
  },
  purchaseInName: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    letterSpacing: -0.02,
    color: COLORS.dark,
    marginVertical: 1,
  },
  totalAmount: {
    fontFamily: 'FHOscar',
    fontSize: 56,
    letterSpacing: -0.01,
    color: COLORS.dark,
    marginTop: 16,
  },
  BOTONPROVISIONAL: {
    width: 100,
    height: 25,
    backgroundColor: COLORS.primary[200],
    position: 'absolute',
    bottom: 20,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Satoshi',
  },
});
