import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/global-styles';
import i18n from '../constants/i18n';
import QRIcon from '../assets/images/icons/QRIcon';

import { CameraView, useCameraPermissions } from 'expo-camera/next';
import * as Clipboard from 'expo-clipboard';
import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '../components/UI/Button';
import ScanQR from './qr/ScanQR';
import ShowQR from './qr/ShowQR';

const QRScreen = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          zIndex: 9999,
          top: 76,
          left: 16,
        }}>
        <Pressable style={styles.backButton} onPress={() => router.push('/')}>
          <Feather name="arrow-left" size={24} color={COLORS.dark} style={{ opacity: 0.5 }} />
        </Pressable>
      </View>
      {/* <ScanQR /> */}
      <ShowQR />
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
  backButton: {
    backgroundColor: COLORS.light,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
