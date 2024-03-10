import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { CameraView, useCameraPermissions } from 'expo-camera/next';

import i18n from '../../constants/i18n';
import Button from '../../components/UI/Button';

const ScanQR = ({}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showAlert, setShowAlert] = useState(false);

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

  //if no amount is in the qr code handle that

  //for now assume that the qr code has an amount

  const handleBarcodeScanned = async ({ type = 'qr', data }: { type: string; data: string }) => {
    setShowAlert(true);
    await Clipboard.setStringAsync(data);
  };

  return (
    <>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
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
