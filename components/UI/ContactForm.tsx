// components/UI/ContactForm.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  selectContact?: () => void; // This function should handle the action of selecting a contact
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
      <View style={styles.selectContactButton}>
        <Text style={styles.selectContactButtonText} onPress={selectContact}>
          {i18n.t('getContacts')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectContactButton: {
    backgroundColor: COLORS.light,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 24,
    // Add other styles as needed
  },
  selectContactButtonText: {
    color: COLORS.primary[600],
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    // Add other styles as needed
  },
  // Add other styles as needed
});

export default ContactForm;
