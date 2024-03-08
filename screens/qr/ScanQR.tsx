import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';

import { CameraView, useCameraPermissions } from 'expo-camera/next';
import * as Clipboard from 'expo-clipboard';
import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.container}>
        <Text>No tienes permisos para acceder a la cámara.</Text>
        <Button title="Solicitar permisos" onPress={requestPermission} />
      </View>
    );
  }

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
          <Text style={styles.alertText}>Código copiado al portapapeles</Text>
        </View>
      )}
    </>
  );
};
export default ScanQR;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
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
