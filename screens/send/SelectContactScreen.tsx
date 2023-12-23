import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { COLORS } from '../../constants/global-styles';
import { useTransaction } from '../../store/TransactionContext';

const SelectContactScreen = () => {
  const { setTransactionData } = useTransaction();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleNext = () => {
    setTransactionData({ recipient: phoneNumber, amount: '', data: '' });
  };

  return (
    <View style={styles.wrapper}>
      <BackButton />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.title}>A quien le enviaras?</Text>
          <Input
            placeholder="Enter a phone number"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Link href="/(app)/send/enterAmount" asChild>
            <Button title="Next" type="primary" onPress={handleNext} />
          </Link>
        </View>
      </View>
    </View>
  );
};
export default SelectContactScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    paddingBottom: 40,
    justifyContent: 'space-between',
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
  buttonWrapper: {
    marginTop: 24,
    flexDirection: 'row',
    marginHorizontal: 12,
  },
});
