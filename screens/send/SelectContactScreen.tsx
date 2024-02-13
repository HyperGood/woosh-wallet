import { Link, router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import PhoneNumberInput from '../../components/UI/PhoneNumberInput';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { usePhoneContacts } from '../../store/ContactsContext';
import { useTransaction } from '../../store/TransactionContext';
import { minMaxScale } from '../../utils/scalingFunctions';

const SelectContactScreen = () => {
  const { setTransactionData } = useTransaction();
  const { phoneContacts, getPhoneContacts } = usePhoneContacts();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+52'); // default to US
  const [recipient, setRecipient] = useState('');
  const [searchText, setSearchText] = useState(''); // Add this line

  const countryCodes = ['+52', '+1']; // Array of country codes

  const filteredContacts = phoneContacts?.filter((contact: any) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNext = (phoneNumber: string, recipient: string, countryCode: string) => {
    setTransactionData({
      recipientPhone: (countryCode + phoneNumber).replace(/\s/g, ''),
      recipientName: recipient,
      amount: '0',
      token: 'USDc',
    });
    router.push('/(app)/send/enterAmount');
  };

  const dropdownRef = useRef<ModalDropdown | null>(null);

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ gap: 16 }}>
          <Text style={styles.title}>{i18n.t('sendSelectContactTitle')}</Text>
          <PhoneNumberInput
            onPhoneNumberChange={setPhoneNumber}
            onCountryCodeChange={setCountryCode}
            initialCountryCode={countryCode}
            initialPhoneNumber={phoneNumber}
          />
          <Input placeholder={i18n.t('enterName')} onChangeText={setRecipient} value={recipient} />
        </View>
        <View style={{ flex: 1, marginTop: 16 }}>
          {phoneContacts ? (
            <View style={{ flex: 1 }}>
              <Input
                placeholder={i18n.t('searchContacts')}
                onChangeText={setSearchText}
                value={searchText}
                theme="light"
                icon
              />
              <FlatList
                data={filteredContacts}
                style={styles.container}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                  <View
                    style={{
                      borderBottomWidth: 1,
                      paddingTop: 8,
                      paddingBottom: 16,
                      borderBottomColor: COLORS.gray[400],
                    }}>
                    <Text
                      style={{
                        color: COLORS.dark,
                        fontFamily: 'Satoshi-Bold',
                        textTransform: 'uppercase',
                        opacity: 0.6,
                      }}>
                      Contacts
                    </Text>
                  </View>
                }
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={<Text>No contacts found</Text>}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      const selectedPhoneNumber = item.phoneNumbers[0].number;
                      const selectedRecipient = item.name;
                      const match = selectedPhoneNumber.match(/^\+\d{1,3}/);
                      const newCountryCode = match ? match[0] : '+52';
                      const phoneNumberWithoutCountryCode = selectedPhoneNumber.replace(
                        /^\+\d{1,3}/,
                        ''
                      );
                      setCountryCode(newCountryCode);
                      setPhoneNumber(phoneNumberWithoutCountryCode);
                      setRecipient(selectedRecipient);
                      const selectedIndex = countryCodes.indexOf(newCountryCode);
                      if (selectedIndex !== -1 && dropdownRef.current) {
                        dropdownRef.current.select(selectedIndex);
                      }
                      handleNext(phoneNumberWithoutCountryCode, selectedRecipient, newCountryCode);
                    }}
                    style={styles.contact}>
                    <Text style={styles.contactName}>{item.name}</Text>
                  </Pressable>
                )}
              />
            </View>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                style={{
                  flex: 1,
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  backgroundColor: COLORS.light,
                  borderRadius: 16,
                  flexDirection: 'row',
                  gap: 8,
                }}
                onPress={getPhoneContacts}>
                <Image
                  source={require('../../assets/images/contacts-icon.png')}
                  style={{ width: 32, height: 32 }}
                />
                <Text style={styles.selectContactButtonText}>{i18n.t('getContacts')}</Text>
              </Pressable>
            </View>
          )}
        </View>
        <View style={styles.buttonWrapper}>
          <Link href="/(app)/send/enterAmount" asChild>
            <Button
              title={i18n.t('next')}
              type="primary"
              onPress={() => handleNext(phoneNumber, recipient, countryCode)}
              disabled={!phoneNumber}
            />
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default SelectContactScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    paddingBottom: 40,
    paddingHorizontal: minMaxScale(12, 16),
  },

  selectContactButtonText: {
    color: COLORS.primary[600],
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
  },
  contact: {
    gap: 10,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[400],
  },
  contactName: {
    color: COLORS.dark,
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
  },
  contactNumber: {
    color: COLORS.dark,
    fontSize: 20,
  },
  container: {
    backgroundColor: COLORS.light,
    flex: 1,
    marginTop: 16,
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 10,
    marginHorizontal: 8,
  },
  title: {
    fontSize: minMaxScale(40, 48),
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: minMaxScale(48, 56),
  },
  buttonWrapper: {
    marginBottom: 24,
    flexDirection: 'row',
  },
});
