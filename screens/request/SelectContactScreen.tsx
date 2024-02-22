import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ModalDropdown from 'react-native-modal-dropdown';
import Animated, {
  Easing,
  Extrapolate,
  FadeIn,
  FadeOut,
  Layout,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import ContactSelector from '../../components/ContactSelector';
import Button from '../../components/UI/Button';
import ContactForm from '../../components/UI/ContactForm';
import Input from '../../components/UI/Input';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import ContactListItem from '../../components/request/ContactListItem';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useKeyboardBottomSheetAdjustment } from '../../hooks/BottomSheet/useKeyboardBottomSheetAdjustment';
import { useToggleBottomSheet } from '../../hooks/BottomSheet/useToggleBottomSheet';
import { usePhoneContacts } from '../../store/ContactsContext';
import { useRequest } from '../../store/RequestContext';
import { minMaxScale } from '../../utils/scalingFunctions';

type Contact = {
  name: string;
  phoneNumber: string;
  amount: number;
};

const INITIAL_COUNTRY_CODE = '+52';
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SelectContactScreen = () => {
  const addContactRef = useRef<BottomSheetRefProps>(null);
  const { requestData, setRequestData } = useRequest();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState(INITIAL_COUNTRY_CODE);
  const [name, setName] = useState('');
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [searchText, setSearchText] = useState('');
  const { phoneContacts, getPhoneContacts } = usePhoneContacts();
  const dropdownRef = useRef<ModalDropdown | null>(null);
  const [step, setStep] = useState(0);
  const isActionTrayOpened = useSharedValue(false);

  const countryCodes = ['+52', '+1']; // Array of country codes

  const filteredContacts = phoneContacts?.filter((contact: any) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );
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

  const close = useCallback(() => {
    addContactRef.current?.close();
    isActionTrayOpened.value = false;
    setStep(0);
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
        close();
        // Remove the listener once done
        keyboardDidHideListener.remove();
      });

      // Dismiss the keyboard
      Keyboard.dismiss();
      close();
    }
  }, [name, phoneNumber]);

  const toggleBottomSheet = useToggleBottomSheet(addContactRef, isActionTrayOpened, close);

  const { keyboardBottomSheetAdjustment } = useKeyboardBottomSheetAdjustment(addContactRef);

  const handleDeleteContact = useCallback((index: number) => {
    setContacts((prev) => {
      if (prev) {
        const newContacts = prev.filter((_, i) => i !== index);
        return newContacts;
      }
      return null;
    });
  }, []);

  const rContentHeight = useDerivedValue(() => {
    // Just a simple interpolation to make the content height dynamic based on the step
    return interpolate(
      step,
      [0, 1, 2],
      [520, SCREEN_HEIGHT > 700 ? 700 : SCREEN_HEIGHT - 80, 250],
      Extrapolate.CLAMP
    );
  }, [step]);

  const rContentStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(rContentHeight.value, {
        damping: 20,
      }),
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <View style={styles.wrapper}>
          <View style={{ flex: 1, justifyContent: 'space-between', marginTop: 32 }}>
            <View>
              <Text style={styles.title}>{i18n.t('requestSelectContactTitle')}</Text>
              <Pressable onPress={toggleBottomSheet} style={styles.addContactButton}>
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
        </View>
        <BottomSheet ref={addContactRef}>
          <Animated.View style={rContentStyle}>
            {step === 0 && (
              <Animated.View
                layout={Layout.easing(Easing.linear).duration(250)}
                exiting={FadeOut.delay(100)}
                style={{ flex: 1, backgroundColor: COLORS.gray[800] }}>
                <Text style={styles.modalText}>{i18n.t('addContact')}</Text>
                <View style={{ gap: 24, paddingHorizontal: 16 }}>
                  <ContactForm
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    countryCode={countryCode}
                    setCountryCode={setCountryCode}
                    name={name}
                    setName={setName}
                    handleOpenKeyboard={keyboardBottomSheetAdjustment}
                    selectContact={() => {
                      getPhoneContacts();
                      setStep(1);
                    }}
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
              </Animated.View>
            )}
            {step === 1 && (
              <Animated.View
                layout={Layout.easing(Easing.linear).duration(250)}
                entering={FadeIn.delay(0)}
                exiting={FadeOut.delay(100)}
                style={{ flex: 1, backgroundColor: COLORS.gray[800] }}>
                <>
                  <Pressable
                    style={{ marginLeft: 16, position: 'absolute', padding: 8 }}
                    onPress={() => setStep(0)}>
                    <Feather name="arrow-left" size={24} color={COLORS.light} />
                  </Pressable>
                  <Text style={styles.modalText}>{i18n.t('addContact')}</Text>
                  <View style={{ gap: 24, paddingHorizontal: 16, flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Input
                        placeholder={i18n.t('searchContacts')}
                        onChangeText={setSearchText}
                        value={searchText}
                        icon
                      />
                      <FlatList
                        data={filteredContacts}
                        style={styles.container}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        ListEmptyComponent={<Text>No contacts found on your phone</Text>}
                        ItemSeparatorComponent={() => (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: COLORS.light,
                              opacity: 0.05,
                              width: '75%',
                              alignSelf: 'center',
                            }}
                          />
                        )}
                        renderItem={({ item }) => (
                          <ContactSelector
                            item={item}
                            setPhoneNumber={setPhoneNumber}
                            setCountryCode={setCountryCode}
                            setName={setName}
                            setStep={setStep} // Only pass this prop where needed
                            countryCodes={countryCodes}
                            dropdownRef={dropdownRef}
                          />
                        )}
                      />
                    </View>
                  </View>
                </>
              </Animated.View>
            )}
          </Animated.View>
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
    paddingBottom: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: COLORS.dark,
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2C2C2E',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginTop: 24,
  },
  contactsContainer: {
    marginTop: 24,
    backgroundColor: COLORS.gray[800],
    borderRadius: 24,
    paddingVertical: 8,
  },
  title: {
    fontSize: minMaxScale(40, 48),
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: minMaxScale(48, 56),
  },
  buttonWrapper: {
    marginTop: 24,
    flexDirection: 'row',
  },
  modalText: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginTop: 16,
    marginBottom: 32,
  },
  container: {
    backgroundColor: COLORS.gray[600],
    flex: 1,
    height: '100%',
    marginTop: 16,
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 10,
    marginHorizontal: 8,
  },
});
