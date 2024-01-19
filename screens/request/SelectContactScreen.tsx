import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Button from '../../components/UI/Button';
import ContactForm from '../../components/UI/ContactForm';
import InnerHeader from '../../components/UI/InnerHeader';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import ContactListItem from '../../components/request/ContactListItem';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useRequest } from '../../store/RequestContext';

type Contact = {
  name: string;
  phoneNumber: string;
  amount: number;
};

const INITIAL_COUNTRY_CODE = '+52';

const SelectContactScreen = () => {
  const addContactRef = useRef<BottomSheetRefProps>(null);
  const { requestData, setRequestData } = useRequest();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState(INITIAL_COUNTRY_CODE);
  const [name, setName] = useState('');
  //Array of contacts via useState
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [isNextClicked, setIsNextClicked] = useState(false);

  const handleNext = () => {
    const totalAmount = requestData?.totalAmount || 100;
    const amountPerPerson = requestData?.amountPerPerson || 100;
    const type = requestData?.type || 'total';

    let updatedContacts: Contact[] | null = null;

    // Update each contact's amount
    if (type === 'total' && contacts) {
      updatedContacts = contacts?.map((contact) => ({
        ...contact,
        amount: totalAmount / (contacts?.length || 1),
      }));
    } else {
      updatedContacts = (contacts || []).map((contact) => ({
        ...contact,
        amount: amountPerPerson,
      }));
    }

    setRequestData(
      (prevData) =>
        ({
          ...prevData,
          contacts: updatedContacts,
          totalAmount: amountPerPerson * (updatedContacts?.length || 1),
        }) as any
    );
    setIsNextClicked(true);
  };

  useEffect(() => {
    if (isNextClicked) {
      router.push('/(app)/request/splits');
      setIsNextClicked(false); // reset the flag
    }
  }, [requestData, isNextClicked]);

  useEffect(() => {
    console.log(requestData);
  }, []);

  const handleAddContact = useCallback(() => {
    if (phoneNumber && name) {
      setContacts((prev) => {
        if (prev) {
          return [...prev, { name, phoneNumber: countryCode + phoneNumber, amount: 0 }];
        } else {
          return [{ name, phoneNumber: countryCode + phoneNumber, amount: 0 }];
        }
      });
      setPhoneNumber('');
      setName('');
      // Listen for keyboardDidHide event
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        addContactRef.current?.close();
        // Remove the listener once done
        keyboardDidHideListener.remove();
      });

      // Dismiss the keyboard
      Keyboard.dismiss();
    }
  }, [name, phoneNumber]);

  const handleOpenBottomSheet = useCallback(() => {
    const isActive = addContactRef.current?.isActive();
    if (isActive) {
      addContactRef.current?.scrollTo(0);
    } else {
      addContactRef.current?.scrollTo(-550);
    }
  }, []);

  const handleOpenKeyboard = useCallback(() => {
    const isActive = addContactRef.current?.isActive();
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
      if (isActive) {
        addContactRef.current?.scrollTo(-550 - e.endCoordinates.height);
      }
    });
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      addContactRef.current?.scrollTo(-550);
    });

    // Cleanup listeners on unmount
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handleDeleteContact = useCallback((index: number) => {
    setContacts((prev) => {
      if (prev) {
        const newContacts = prev.filter((_, i) => i !== index);
        return newContacts;
      }
      return null;
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.wrapper}>
        <InnerHeader title={i18n.t('requestHeaderTitle')} />
        <View style={{ flex: 1, justifyContent: 'space-between', marginTop: 32 }}>
          <View>
            <Text style={styles.title}>{i18n.t('requestSelectContactTitle')}</Text>
            <Pressable
              onPress={handleOpenBottomSheet}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#2C2C2E',
                paddingVertical: 24,
                paddingHorizontal: 16,
                borderRadius: 24,
                marginHorizontal: 16,
                marginTop: 24,
              }}>
              <View
                style={{
                  backgroundColor: COLORS.primary[400],
                  borderRadius: 100,
                  height: 32,
                  width: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Feather name="plus" size={16} color={COLORS.light} />
              </View>
              <Text
                style={{ color: COLORS.primary[400], fontFamily: 'Satoshi-Bold', fontSize: 18 }}>
                {i18n.t('addContact')}
              </Text>
            </Pressable>
            {contacts && contacts?.length > 0 && (
              <FlatList
                data={contacts}
                renderItem={({ item, index }) => (
                  <ContactListItem
                    name={item.name}
                    phoneNumber={item.phoneNumber}
                    onDelete={() => handleDeleteContact(index)}
                  />
                )}
                keyExtractor={(item) => item.phoneNumber}
                style={styles.contactsContainer}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: COLORS.light,
                      opacity: 0.05,
                      width: '75%',
                      alignSelf: 'center',
                      marginVertical: 8,
                    }}
                  />
                )}
              />
            )}
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title={i18n.t('next')}
              icon="arrow-right"
              type="primary"
              onPress={() => handleNext()}
              disabled={!contacts || contacts.length === 0}
            />
          </View>
        </View>
        <BottomSheet ref={addContactRef}>
          <Text style={styles.modalText}>{i18n.t('addContact')}</Text>
          <View style={{ gap: 24, paddingHorizontal: 16 }}>
            <ContactForm
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              name={name}
              setName={setName}
              handleOpenKeyboard={handleOpenKeyboard}
            />
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <Button
                title={i18n.t('add')}
                icon="plus"
                type="primary"
                onPress={handleAddContact}
                disabled={!name}
              />
            </View>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default SelectContactScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    paddingBottom: 40,
    justifyContent: 'space-between',
    backgroundColor: COLORS.dark,
  },
  contactsContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.gray[800],
    borderRadius: 24,
    paddingVertical: 8,
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
  modalText: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginTop: 16,
    marginBottom: 32,
  },
});
