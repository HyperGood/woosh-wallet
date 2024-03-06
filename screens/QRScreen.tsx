import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/global-styles';
import i18n from '../constants/i18n';
import { useState } from 'react';
import Button from '../components/UI/Button';
import { scale } from '../utils/scalingFunctions';
import QRIcon from '../assets/images/icons/QRIcon';

const QRScreen = () => {
    function createWallet() {
      console.log('Creating wallet Wallet');
    }
  
    return (
    <View style={styles.container}>
      <View
        style={{
          alignSelf: 'flex-start',
          paddingTop: 56,
          paddingLeft: 16,
        }}>
        <Pressable style={styles.backButton} onPress={() => router.push('/')}>
          <Feather name="arrow-left" size={24} color={COLORS.dark} style={{ opacity: 0.5 }} />
        </Pressable>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100}}>
        <View style={styles.qRPlaceHolder}><QRIcon color={COLORS.dark} /></View>
        <Text style={styles.accountName}>$account1</Text>
        {true && (
          <View>
            <Text style={{ fontSize: 17, fontFamily: 'Satoshi', textAlign: 'center' }}>Requesting</Text>
            <Text style={styles.number}>
              $500.
              <Text style={styles.decimal}>00 MXN</Text>
            </Text>
            <Text style={{ fontSize: 17, fontFamily: 'Satoshi', opacity: .5, textAlign: 'center' }}>26.79 USDc</Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Link href="/" asChild>
            <Button title="Edit Amount" type="primary" onPress={(createWallet)} />
          </Link>
        </View>
      </View>
    </View>
  );
};
export default QRScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary[400],
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
    fontWeight: "700",
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
    fontFamily: 'FHOscar',
  },
  buttonContainer: {
    width: 224,
    marginTop: 24,
    flexDirection: 'row',
  }
});