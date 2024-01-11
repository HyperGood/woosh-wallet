import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { COLORS } from '../../constants/global-styles';
import { useContacts } from '../../store/ContactsContext';
import { useTransaction } from '../../store/TransactionContext';

const SelectContactScreen = () => {
  const { setTransactionData } = useTransaction();
  const { contacts, getContacts } = useContacts();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recipient, setRecipient] = useState('');
  const [searchText, setSearchText] = useState(''); // Add this line

  const filteredContacts = contacts?.filter((contact: any) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNext = (phoneNumber: string, recipient: string) => {
    setTransactionData({
      recipientPhone: phoneNumber,
      recipientName: recipient,
      amount: '0',
      token: 'USDc',
    });
  };
  return (
    <View style={styles.wrapper}>
      <BackButton />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ gap: 16 }}>
          <Text style={styles.title}>A quien le enviaras?</Text>
          <Input
            placeholder="Enter a phone number"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
          <Input placeholder="Enter a name" onChangeText={setRecipient} value={recipient} />
        </View>
        <View style={{ flex: 1, marginTop: 16 }}>
          {contacts ? (
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Search contacts"
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
                  <Link href="/(app)/send/enterAmount" asChild>
                    <Pressable
                      onPress={() => {
                        const selectedPhoneNumber = item.phoneNumbers[0].number;
                        const selectedRecipient = item.name;
                        setPhoneNumber(selectedPhoneNumber);
                        setRecipient(selectedRecipient);
                        handleNext(selectedPhoneNumber, selectedRecipient);
                      }}
                      style={styles.contact}>
                      <Text style={styles.contactName}>{item.name}</Text>
                    </Pressable>
                  </Link>
                )}
              />
            </View>
          ) : (
            <Pressable onPress={getContacts}>
              <Text style={{ color: COLORS.light }}>Select from contacts</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.buttonWrapper}>
          <Link href="/(app)/send/enterAmount" asChild>
            <Button
              title="Next"
              type="primary"
              onPress={() => handleNext(phoneNumber, recipient)}
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
