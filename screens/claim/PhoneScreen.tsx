import { useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Alert } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import PhoneNumberInput from '../../components/UI/PhoneNumberInput';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';

interface IntroScreenProps {
  transactionData: any;
  nextScreenFunction: () => void;
  backFuncion: () => void;
}

const IntroScreen = ({ transactionData, nextScreenFunction, backFuncion }: IntroScreenProps) => {
  const [countryCode, setCountryCode] = useState('+52');
  const [phoneNumber, setPhoneNumber] = useState('');

  const onButtonClick = () => {
    if (countryCode + phoneNumber === transactionData.recipientPhone) {
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
            {transactionData.sender} {i18n.t('sentYou')}
          </Text>
          <Text style={styles.title}>
            {transactionData.amount} {transactionData.token}
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
export default IntroScreen;
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
  },
  description: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Satoshi',
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
    maxWidth: 300,
  },
  textContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
    gap: 4,
  },
  welcomeTitle: {
    fontSize: 20,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
    maxWidth: 300,
  },
});
