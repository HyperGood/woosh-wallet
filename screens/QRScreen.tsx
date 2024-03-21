import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '../constants/global-styles';
import i18n from '../constants/i18n';
import ScanQR from './qr/ScanQR';
import ShowQR from './qr/ShowQR';
import QRShow from '../assets/images/icons/QRShow';
import QRScan from '../assets/images/icons/QRScan';

const QRScreen = () => {
  const [showScanQR, setShowScanQR] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [scanQRStep, setScanQRStep] = useState(0);

  const showScanQRScreen = () => {
    setShowScanQR(true);
  };

  const showShowQRScreen = () => {
    setShowScanQR(false);
  };

  const backButtonPressed = () => {
    router.push('/');
    setScanQRStep(0);
    setIsBottomSheetOpen(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          zIndex: 9999,
          top: 45,
          left: 16,
          display: scanQRStep === 1 ? 'none' : 'flex',
        }}>
        <Pressable style={styles.backButton} onPress={backButtonPressed}>
          <Feather name="arrow-left" size={24} color={COLORS.dark} style={{ opacity: 0.5 }} />
        </Pressable>
      </View>
      <View style={[{ display: isBottomSheetOpen ? 'none' : 'flex' }, styles.navigation]}>
        <Pressable
          style={[
            styles.navigationButton,
            { backgroundColor: showScanQR ? '#DFF7E5' : COLORS.light },
          ]}
          onPress={showScanQRScreen}>
          <QRScan color={showScanQR ? '#17CE4A' : 'black'} />
          <Text style={{ color: showScanQR ? '#17CE4A' : 'black', fontSize: 18, paddingLeft: 8 }}>
            {i18n.t('scanQR')}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.navigationButton,
            { backgroundColor: showScanQR ? COLORS.light : '#DFF7E5' },
          ]}
          onPress={showShowQRScreen}>
          <QRShow color={showScanQR ? 'black' : '#17CE4A'} />
          <Text style={{ color: showScanQR ? 'black' : '#17CE4A', fontSize: 18, paddingLeft: 8 }}>
            {i18n.t('showQR')}
          </Text>
        </Pressable>
      </View>
      {showScanQR ? (
        <ScanQR disableNav={setIsBottomSheetOpen} step={scanQRStep} setStep={setScanQRStep} />
      ) : (
        <ShowQR isBottomSheetOpen={isBottomSheetOpen} setIsBottomSheetOpen={setIsBottomSheetOpen} />
      )}
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
  },
  backButton: {
    backgroundColor: COLORS.light,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigation: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    width: 400,
    height: 72,
    backgroundColor: COLORS.light,
    borderRadius: 50,
    zIndex: 1,
  },
  navigationButton: {
    flexDirection: 'row',
    width: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});