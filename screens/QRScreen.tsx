import { CameraView, useCameraPermissions } from 'expo-camera/next';
import * as Clipboard from 'expo-clipboard';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../components/UI/Button';

const QRScreen = () => {
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

  function createWallet() {
    console.log('Creating wallet Wallet');
  }

  return (
    <View style={styles.container}>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}>
        {showAlert && (
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>Código copiado al portapapeles</Text>
          </View>
        )}

        {
          // <View style={styles.container}>
          //   <View
          //     style={{
          //       alignSelf: 'flex-start',
          //       paddingTop: 56,
          //       paddingLeft: 16,
          //     }}>
          //     <Pressable style={styles.backButton} onPress={() => router.push('/')}>
          //       <Feather name="arrow-left" size={24} color={COLORS.dark} style={{ opacity: 0.5 }} />
          //     </Pressable>
          //   </View>
          //   <View
          //     style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 }}>
          //     <View style={styles.qRPlaceHolder}>
          //       <QRIcon color={COLORS.dark} />
          //     </View>
          //     <Text style={styles.accountName}>$account1</Text>
          //     {true && (
          //       <View>
          //         <Text style={{ fontSize: 17, fontFamily: 'Satoshi', textAlign: 'center' }}>
          //           Requesting
          //         </Text>
          //         <Text style={styles.number}>
          //           $500.
          //           <Text style={styles.decimal}>00 MXN</Text>
          //         </Text>
          //         <Text
          //           style={{ fontSize: 17, fontFamily: 'Satoshi', opacity: 0.5, textAlign: 'center' }}>
          //           26.79 USDc
          //         </Text>
          //       </View>
          //     )}
          //     <View style={styles.buttonContainer}>
          //       <Link href="/" asChild>
          //         <Button title="Edit Amount" type="primary" onPress={createWallet} />
          //       </Link>
          //     </View>
          //   </View>
          // </View>
        }
      </CameraView>
    </View>
  );
};
export default QRScreen;
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
  // container: {
  //   flex: 1,
  //   backgroundColor: COLORS.primary[400],
  // },
  // backButton: {
  //   backgroundColor: COLORS.light,
  //   width: 48,
  //   height: 48,
  //   borderRadius: 24,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // qRPlaceHolder: {
  //   height: 257,
  //   width: 257,
  //   backgroundColor: COLORS.light,
  //   borderRadius: 16,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // accountName: {
  //   fontSize: 32,
  //   fontFamily: 'Satoshi',
  //   fontWeight: "700",
  //   color: COLORS.dark,
  //   marginVertical: 20,
  // },
  // number: {
  //   fontSize: 64,
  //   fontFamily: 'FHOscar',
  //   marginVertical: 1,
  //   textAlign: 'center',
  // },
  // decimal: {
  //   fontSize: 32,
  //   fontFamily: 'FHOscar',
  // },
  // buttonContainer: {
  //   width: 224,
  //   marginTop: 24,
  //   flexDirection: 'row',
  // }
});
