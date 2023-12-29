import { useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Alert } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { COLORS } from '../../constants/global-styles';

interface IntroScreenProps {
  transactionData: any;
  nextScreenFunction: () => void;
}

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
      <BackButton />
      <Text style={styles.title}>{transactionData.sender} sent you</Text>
      <Text style={styles.title}>
        {transactionData.amount} {transactionData.token}
      </Text>
      <Text>Enter your phone number to continue</Text>

      <Input
        placeholder="Enter your phone number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
      />

      <View style={{ flexDirection: 'row' }}>
        <Button title="Claim" onPress={onButtonClick} type="primary" />
      </View>
    </SafeAreaView>
  );
};
export default IntroScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
    marginHorizontal: 32,
    marginBottom: 16,
  },
});
