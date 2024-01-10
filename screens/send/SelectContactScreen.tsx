import { Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useContacts } from '../../store/ContactsContext';
import { useTransaction } from '../../store/TransactionContext';

const SelectContactScreen = () => {
  const { setTransactionData } = useTransaction();
  const { contacts, getContacts } = useContacts();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+52'); // default to US
  const [recipient, setRecipient] = useState('');
  const [searchText, setSearchText] = useState(''); // Add this line

  const countryCodes = ['+52', '+1']; // Array of country codes
  const countryNames = ['🇲🇽 MX +52', '🇺🇸 US +1']; // Array of country names for display

  const filteredContacts = contacts?.filter((contact: any) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNext = (phoneNumber: string, recipient: string, countryCode: string) => {
    setTransactionData({
      recipientPhone: (countryCode + phoneNumber).replace(/\s/g, ''),
      recipientName: recipient,
      amount: '0',
      token: 'ETH',
    });
    router.push('/(app)/send/enterAmount');
  };

  const dropdownRef = useRef<ModalDropdown | null>(null);

  return (
    <View style={styles.wrapper}>
      <BackButton />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ gap: 16 }}>
          <Text style={styles.title}>{i18n.t('sendSelectContactTitle')}</Text>
          <View style={{ flexDirection: 'row', marginHorizontal: 16 }}>
            <ModalDropdown
              ref={dropdownRef}
              options={countryNames}
              onSelect={(index, value) => {
                const selectedIndex = parseInt(index, 10);
                setCountryCode(countryCodes[selectedIndex]);
              }}
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
                onChangeText={setPhoneNumber}
                value={phoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          <Input placeholder={i18n.t('enterName')} onChangeText={setRecipient} value={recipient} />
        </View>
        <View style={{ flex: 1, marginTop: 16 }}>
          {contacts ? (
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
                  padding: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.light,
                  borderRadius: 16,
                }}
                onPress={getContacts}>
                <Text
                  style={{
                    color: COLORS.dark,
                    fontFamily: 'Satoshi-Bold',
                    fontSize: 16,
                    textDecorationLine: 'underline',
                  }}>
                  {i18n.t('getContacts')}
                </Text>
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
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
    marginHorizontal: 32,
  },
  buttonWrapper: {
    marginTop: 24,
    flexDirection: 'row',
    marginHorizontal: 12,
  },
});
