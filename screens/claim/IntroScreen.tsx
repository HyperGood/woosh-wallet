import { useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Alert } from 'react-native';

import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { COLORS } from '../../constants/global-styles';

interface IntroScreenProps {
  transactionData: any;
  nextScreenFunction: () => void;
}

//TODO: Add onboarding slides

const IntroScreen = ({ transactionData, nextScreenFunction }: IntroScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const onButtonClick = () => {
    if (phoneNumber === transactionData.recipientPhone) {
      console.log('Phone number is correct');
      nextScreenFunction();
    } else {
      Alert.alert('Phone number is incorrect');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Woosh!</Text>
          <Text style={styles.title}>{transactionData.sender} sent you</Text>
          <Text style={styles.title}>
            {transactionData.amount} {transactionData.token}
          </Text>
          <Text style={styles.description}>Enter your phone number to continue</Text>
        </View>

        <Input
          placeholder="Enter your phone number"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />
      </View>

      <View style={{ flexDirection: 'row', paddingBottom: 32, paddingHorizontal: 16 }}>
        <Button title="Claim" onPress={onButtonClick} type="primary" />
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
