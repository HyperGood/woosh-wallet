import { Feather } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import PhoneNumberInput from '../../components/UI/PhoneNumberInput';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import { COLORS } from '../../constants/global-styles';
import { useRequest } from '../../store/RequestContext';

type Contact = {
  name: string;
  phoneNumber: string;
};

const SelectContactScreen = () => {
  const addContactRef = useRef<BottomSheetRefProps>(null);
  const { requestData } = useRequest();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [name, setName] = useState('');
  //Array of contacts via useState
  const [contacts, setContacts] = useState<Contact[] | null>(null);

  const handleNext = () => {
    console.log(requestData);
  };

  const handleAddContact = useCallback(() => {
    if (phoneNumber && name) {
      setContacts((prev) => {
        if (prev) {
          return [...prev, { name, phoneNumber }];
        } else {
          return [{ name, phoneNumber }];
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
        <View style={styles.header}>
          <View style={{ position: 'absolute', left: 0 }}>
            <BackButton />
          </View>
          <Text style={styles.headerTitle}>Solicitar Pago</Text>
          <View />
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.title}>Agrega contactos</Text>
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
                Add a contact
              </Text>
            </Pressable>
            {contacts && contacts?.length > 0 && (
              <FlatList
                data={contacts}
                renderItem={({ item, index }) => (
                  <View style={styles.contact}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View>
                        <Image
                          source={require('../../assets/images/profile.png')}
                          style={{ width: 40, height: 40, borderRadius: 100 }}
                        />
                      </View>
                      <View>
                        <Text style={styles.contactName}>{item.name}</Text>
                        <Text style={styles.contactNumber}>{item.phoneNumber}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      <Pressable
                        style={styles.contactIcon}
                        onPress={() => handleDeleteContact(index)}>
                        <Feather name="trash-2" size={16} color={COLORS.light} />
                      </Pressable>
                      {/* <Pressable
                      style={styles.contactIcon}
                      onPress={() => handleEditContactOpen(index, item.name, item.phoneNumber)}>
                      <Feather name="edit-3" size={16} color={COLORS.light} />
                    </Pressable> */}
                    </View>
                  </View>
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
            <Button title="Next" type="primary" onPress={() => handleNext()} />
          </View>
        </View>
        <BottomSheet ref={addContactRef}>
          <Text style={styles.modalText}>Agrega Un Contacto</Text>
          <View style={{ gap: 24, paddingHorizontal: 16 }}>
            <PhoneNumberInput
              onPhoneNumberChange={setPhoneNumber}
              onCountryCodeChange={setCountryCode}
              initialCountryCode={countryCode}
              initialPhoneNumber={phoneNumber}
              handleOpenKeyboard={handleOpenKeyboard}
            />

            <Input
              placeholder="Name"
              value={name}
              onChangeText={setName}
              handleOpenKeyboard={handleOpenKeyboard}
            />
            <View style={styles.selectContactButton}>
              <Text style={styles.selectContactButtonText}>Seleccionar de mis contactos</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <Button title="Add" type="primary" onPress={handleAddContact} disabled={!name} />
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
  contactIcon: {
    backgroundColor: COLORS.gray[600],
    padding: 8,
    borderRadius: 100,
  },
  contactsContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.gray[800],
    borderRadius: 24,
    paddingVertical: 8,
  },
  contact: {
    gap: 10,
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
  modalText: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginTop: 16,
    marginBottom: 32,
  },
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
  headerTitle: {
    fontSize: 24,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    position: 'relative',
  },
});
