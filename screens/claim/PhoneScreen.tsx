import { useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Alert } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import PhoneNumberInput from '../../components/UI/PhoneNumberInput';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { minMaxScale } from '../../utils/scalingFunctions';

interface IntroScreenProps {
  transactionData: any;
  nextScreenFunction: () => void;
  backFuncion: () => void;
}

const PhoneScreen = ({ transactionData, nextScreenFunction, backFuncion }: IntroScreenProps) => {
  const [countryCode, setCountryCode] = useState('+52');
  const [phoneNumber, setPhoneNumber] = useState('');

  const onButtonClick = () => {
    const recipientPhone = transactionData.recipientPhone || transactionData.recipientInfo;
    if (countryCode + phoneNumber === recipientPhone || recipientPhone === phoneNumber) {
      console.log('Phone number is correct');
      nextScreenFunction();
    } else {
      Alert.alert('Phone number is incorrect');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton backFunction={backFuncion} />
        <View style={styles.textContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Woosh!</Text>
          <Text style={styles.title}>
            Claim the{' '}
            <Text style={styles.title}>
              $
              {parseFloat(transactionData.amount).toLocaleString('en-US', {
                maximumFractionDigits: 5,
                minimumFractionDigits: 2,
              })}{' '}
              USD
            </Text>{' '}
            {transactionData.sender} {i18n.t('sentYou')}
          </Text>
          <Text style={styles.description}>{i18n.t('claimIntroScreenDescription')}</Text>
        </View>

        <PhoneNumberInput
          onPhoneNumberChange={setPhoneNumber}
          onCountryCodeChange={setCountryCode}
          initialCountryCode={countryCode}
          initialPhoneNumber={phoneNumber}
        />
      </View>
      <View style={{ flexDirection: 'row', paddingBottom: 32, paddingHorizontal: 16 }}>
        <Button
          title={i18n.t('next')}
          onPress={onButtonClick}
          type="primary"
          disabled={!phoneNumber}
        />
      </View>
    </SafeAreaView>
  );
};
export default PhoneScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    paddingTop: 64,
    paddingHorizontal: 16,
  },
  description: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Satoshi',
  },
  title: {
    fontSize: minMaxScale(40, 48),
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: minMaxScale(48, 56),
    maxWidth: 300,
  },
  textContainer: {
    marginBottom: 32,
    gap: 4,
  },
  welcomeTitle: {
    fontSize: 20,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 32,
  },
});
