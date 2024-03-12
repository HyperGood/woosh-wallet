import { CameraView, useCameraPermissions } from 'expo-camera/next';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../../components/UI/Button';
import i18n from '../../constants/i18n';
import { useSendUSDc } from '../../hooks/Transactions/useSendUSDc';

const ScanQR = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showAlert, setShowAlert] = useState(false);
  const { sendUSDc } = useSendUSDc();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

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

      if (transactionData.address && transactionData.amount) {
        // send the value to the address
        sendUSDc(transactionData.amount.toString(), transactionData.address);
        resetScannedState(false, 'sending');
      } else if (transactionData.address) {
        // alert the user that there's no value
        resetScannedState(true, 'no value');
      } else {
        // alert the user that the address is invalid
        resetScannedState(true, 'invalid address');
      }
    }
  };

  return (
    <>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
          interval: 2000,
        }}
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
      />
      {showAlert && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>{i18n.t('qRCopied')}</Text>
        </View>
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
});
