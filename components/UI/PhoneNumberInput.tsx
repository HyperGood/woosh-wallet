import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import Input from '../../components/UI/Input';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';

interface PhoneNumberInputProps {
  onPhoneNumberChange: (phoneNumber: string) => void;
  onCountryCodeChange: (countryCode: string) => void;
  initialCountryCode: string;
  initialPhoneNumber: string;
}

const PhoneNumberInput = ({
  onPhoneNumberChange,
  onCountryCodeChange,
  initialCountryCode,
  initialPhoneNumber,
}: PhoneNumberInputProps) => {
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  const countryCodes = ['+52', '+1']; // Array of country codes
  const countryNames = ['🇲🇽 MX +52', '🇺🇸 US +1']; // Array of country names for display

  const dropdownRef = useRef<ModalDropdown | null>(null);

  const handleCountryCodeChange = (index: string, value: string) => {
    const selectedIndex = parseInt(index, 10);
    const newCountryCode = countryCodes[selectedIndex];
    setCountryCode(newCountryCode);
    onCountryCodeChange(newCountryCode);
  };

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    setPhoneNumber(newPhoneNumber);
    onPhoneNumberChange(newPhoneNumber);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flexDirection: 'row', marginLeft: 16, paddingVertical: 8 }}>
        <ModalDropdown
          ref={dropdownRef}
          options={countryNames}
          onSelect={handleCountryCodeChange}
          defaultValue={countryNames[0]}
          style={{
            backgroundColor: COLORS.gray[800],
            borderRadius: 16,
            borderWidth: 0,
          }}
          dropdownStyle={{
            borderRadius: 16,
            backgroundColor: COLORS.gray[800],
            padding: 16,
            borderWidth: 0,
            marginTop: 8,
          }}
          dropdownTextStyle={{
            fontSize: 18,
            color: COLORS.light,
            backgroundColor: COLORS.gray[800],
          }}
          textStyle={{
            fontSize: 18,
            color: COLORS.light,
            paddingHorizontal: 8,
            paddingVertical: 24,
          }}
          dropdownTextHighlightStyle={{
            fontSize: 18,
            color: COLORS.dark,
            backgroundColor: COLORS.primary[400],
            borderRadius: 16,
          }}
          renderRightComponent={() => (
            <Feather
              name="chevron-down"
              color={COLORS.light}
              size={20}
              style={{ paddingRight: 8 }}
            />
          )}
        />
        <View style={{ flex: 1 }}>
          <Input
            placeholder={i18n.t('selectContactPlaceholder')}
            onChangeText={handlePhoneNumberChange}
            value={phoneNumber}
            keyboardType="phone-pad"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PhoneNumberInput;
