import { Feather } from '@expo/vector-icons';
import React, { Key } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCallback, useRef } from 'react';

import { COLORS } from '../../../constants/global-styles';
import BottomSheet, { BottomSheetRefProps } from '../../modals/BottomSheet';
import { useSharedValue } from 'react-native-reanimated';
import Button from '../../UI/Button';
import { Link } from 'expo-router';
import i18n from '../../../constants/i18n';

interface TransactionInformationProps {
    children?: React.ReactNode;
    id?: Key;
    amount: string;
    token?: string;
    amountInUSD: number;
    recipientName?: string;
    recipientPhone?: string;
    claimedAt?: Date;
    createdAt: Date;
    claimed?: boolean;
}

const windowWidth = Dimensions.get('window').width;

const TransactionInformation: React.FC<TransactionInformationProps> = ({ children, id, amount, token, amountInUSD, recipientName, recipientPhone, claimedAt, createdAt, claimed }) => {
    const transactionDetailsRef = useRef<BottomSheetRefProps>(null);
    const isActionTrayOpened = useSharedValue(false);

    const close = useCallback(() => {
        transactionDetailsRef.current?.close();
        isActionTrayOpened.value = false;
    }, []);

    const toggleActionTray = useCallback(() => {
        const isActive = transactionDetailsRef.current?.isActive() ?? false;
        isActionTrayOpened.value = !isActive;
        isActive ? close() : transactionDetailsRef.current?.open();
    }, [close, isActionTrayOpened]);
    return (
      <>
        <Pressable onPress={toggleActionTray} key={id}>
          {children}
        </Pressable>
        <View style={styles.bottomSheetContainer}>
          <BottomSheet ref={transactionDetailsRef} colorMode="light">
            <View style={styles.transactionDetailsContainer}>
              <View style={styles.transactionState}>
                <View
                  style={[
                    claimed
                      ? { backgroundColor: COLORS.secondary[400] }
                      : { backgroundColor: 'gold' },
                    styles.statusCircle,
                  ]}
                />
                <Text style={styles.claimedState}>{claimed ? i18n.t('claimed') : i18n.t('unclaimed')}</Text>
                {claimed && <Text style={styles.cancelTransactionButton}>{i18n.t('cancel')}</Text>}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'gray', opacity: 0.5 }} />
              </View>
              <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
                <View style={{ justifyContent: 'center', paddingHorizontal: 3 }}>
                  <Image
                    source={require('./temp/lilly.jpg')}
                    style={styles.transactionUserDataImage}
                  />
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.sendBackground}>
                      <Feather name="send" size={16} color={COLORS.gray[800]} />
                    </View>
                    <Text style={styles.sendTo}>{i18n.t('sentTo')}: {recipientName}</Text>
                  </View>
                  <Text style={styles.sendData}>
                    {recipientPhone
                      ? recipientPhone.replace(/^(\+\d{2})(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3-$4')
                      : ''}
                  </Text>
                  {claimed && (
                    <Text style={styles.sendData}>
                      {i18n.t('claimed')}:{' '}
                      {claimedAt?.toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.transactionData}>
                <Text style={styles.totalAmountNumber}>
                  ${amount.split('.')[0]}.
                  <Text style={styles.totalAmountDecimal}>
                    {amount.split('.')[1] ? amount.split('.')[1].padEnd(2, '0') : '00'}
                  </Text>
                </Text>
                <Text style={styles.extraTransactionData}>{amountInUSD.toFixed(2)} {token}</Text>
                <Text style={styles.extraTransactionData}>
                  {createdAt.toLocaleString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
                <Link href="https://base-sepolia.blockscout.com" asChild>
                  <Pressable style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>{i18n.t('viewOnBlockchain')}</Text>
                  </Pressable>
                </Link>
              </View>
              <View>
                <Button
                  title={claimed ? i18n.t('shareTransaction') : i18n.t('copyLink')}
                  icon="link"
                  type="primary"
                  onPress={() => {}}
                />
              </View>
            </View>
          </BottomSheet>
        </View>
      </>
    );
};
export default TransactionInformation;
const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: 'absolute',
    width: windowWidth,
    left: -10,
    bottom: 0,
    zIndex: 9999,
  },
  transactionDetailsContainer: {
    padding: 20,
  },
  transactionState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  claimedState: {
    flex: 5,
    fontFamily: 'Satoshi',
    fontSize: 16,
    letterSpacing: -0.02,
    color: COLORS.dark,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  cancelTransactionButton: {
    fontFamily: 'Satoshi',
    color: 'red',
    justifyContent: 'center',
  },
  transactionUserDataImage: {
    height: 66,
    width: 66,
    borderRadius: 33,
    backgroundColor: COLORS.gray[400],
  },
  sendBackground: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: COLORS.secondary[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendTo: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 21,
    letterSpacing: -0.2,
    color: COLORS.dark,
    marginVertical: 3,
    paddingLeft: 10,
  },
  sendData: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    letterSpacing: -0.02,
    color: COLORS.gray[600],
    opacity: 0.8,
    marginVertical: 3,
  },
  transactionData: {
    marginVertical: 50,
  },
  totalAmountNumber: {
    fontSize: 74,
    fontFamily: 'FHOscar',
    color: COLORS.dark,
    textAlign: 'center',
  },
  totalAmountDecimal: {
    fontSize: 44,
    fontFamily: 'FHOscar',
  },
  extraTransactionData: {
    fontFamily: 'Satoshi',
    fontSize: 18,
    color: COLORS.gray[600],
    opacity: 0.9,
    marginVertical: 5,
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    opacity: 0.6,
    gap: 4,
  },
  viewAllText: {
    fontFamily: 'Satoshi',
    textDecorationLine: 'underline',
    fontSize: 16,
    color: COLORS.dark,
  },
});