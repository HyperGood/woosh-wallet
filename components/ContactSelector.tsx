import type { Contact } from 'expo-contacts';
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

import { COLORS } from '../constants/global-styles';

type ContactSelectorProps = {
  item: Contact;
  setPhoneNumber?: (phoneNumber: string) => void;
  setCountryCode?: (countryCode: string) => void;
  setName?: (name: string) => void;
  setStep?: (step: number) => void;
  close?: () => void;
  countryCodes?: string[];
  dropdownRef?: React.RefObject<any>;
};

const ContactSelector: React.FC<ContactSelectorProps> = ({
  item,
  setPhoneNumber,
  setCountryCode,
  setName,
  setStep,
  countryCodes,
  dropdownRef,
  close,
}) => {
  const handlePress = () => {
    if (!setCountryCode || !setPhoneNumber || !setName) {
      return;
    }
    let selectedPhoneNumber = item.phoneNumbers![0].number;
    const selectedRecipient = item.name;

    // Remove spaces, dashes, and parentheses from the phone number
    selectedPhoneNumber = selectedPhoneNumber?.replace(/[-\s()]/g, '');
    let phoneNumberWithoutCountryCode;

    let newCountryCode = '+52'; // Default country code
    if (selectedPhoneNumber?.startsWith('+1')) {
      newCountryCode = '+1';
      phoneNumberWithoutCountryCode = selectedPhoneNumber.substring(newCountryCode.length);
    } else if (selectedPhoneNumber?.startsWith('+52')) {
      newCountryCode = '+52';
      phoneNumberWithoutCountryCode = selectedPhoneNumber.substring(newCountryCode.length);
    } else {
      phoneNumberWithoutCountryCode = selectedPhoneNumber;
    }

    setCountryCode(newCountryCode);
    setPhoneNumber(phoneNumberWithoutCountryCode || '');
    setName(selectedRecipient);

    const selectedIndex = countryCodes?.indexOf(newCountryCode);
    if (selectedIndex !== -1 && dropdownRef?.current) {
      dropdownRef.current.select(selectedIndex);
    }
    if (setStep) {
      setStep(0);
    }
    if (close) {
      close();
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.contact}>
      <View>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactNumber}>{item.phoneNumbers![0].number}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  contact: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 24,
  },
  contactName: {
    color: COLORS.light,
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
  },
  contactNumber: {
    color: COLORS.light,
    fontSize: 14,
    opacity: 0.4,
  },
});

export default ContactSelector;
