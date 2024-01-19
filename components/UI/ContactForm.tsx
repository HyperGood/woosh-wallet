// components/UI/ContactForm.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import Input from './Input';
import PhoneNumberInput from './PhoneNumberInput';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';

type ContactFormProps = {
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  countryCode: string;
  setCountryCode: (countryCode: string) => void;
  name: string;
  setName: (name: string) => void;
  handleOpenKeyboard: () => void;
  selectContact: () => void;
};

const ContactForm: React.FC<ContactFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  countryCode,
  setCountryCode,
  name,
  setName,
  handleOpenKeyboard,
  selectContact,
}) => {
  return (
    <View style={{ gap: 24 }}>
      <PhoneNumberInput
        onPhoneNumberChange={setPhoneNumber}
        onCountryCodeChange={setCountryCode}
        initialCountryCode={countryCode}
        initialPhoneNumber={phoneNumber}
        handleOpenKeyboard={handleOpenKeyboard}
      />

      <Input
        placeholder={i18n.t('enterName')}
        value={name}
        onChangeText={setName}
        handleOpenKeyboard={handleOpenKeyboard}
      />
      <Pressable style={styles.selectContactButton} onPress={selectContact}>
        <Text style={styles.selectContactButtonText}>{i18n.t('getContacts')}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  selectContactButton: {
    backgroundColor: COLORS.light,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  selectContactButtonText: {
    color: COLORS.primary[600],
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
  },
  modalText: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginTop: 16,
    marginBottom: 32,
  },
});

export default ContactForm;
