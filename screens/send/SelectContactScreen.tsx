import { Link, router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ModalDropdown from 'react-native-modal-dropdown';
import Animated, {
  Easing,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import ContactSelector from '../../components/ContactSelector';
import Button from '../../components/UI/Button';
import ContactForm from '../../components/UI/ContactForm';
import Input from '../../components/UI/Input';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useKeyboardBottomSheetAdjustment } from '../../hooks/BottomSheet/useKeyboardBottomSheetAdjustment';
import { useToggleBottomSheet } from '../../hooks/BottomSheet/useToggleBottomSheet';
import { usePhoneContacts } from '../../store/ContactsContext';
import { useTransaction } from '../../store/TransactionContext';
import { minMaxScale } from '../../utils/scalingFunctions';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const SelectContactScreen = () => {
  const addContactRef = useRef<BottomSheetRefProps>(null);
  const { setTransactionData } = useTransaction();
  const { phoneContacts, getPhoneContacts } = usePhoneContacts();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+52'); // default to US
  const [recipient, setRecipient] = useState('');
  const [searchText, setSearchText] = useState('');
  const isActionTrayOpened = useSharedValue(false);

  const countryCodes = ['+52', '+1']; // Array of country codes

  const filteredContacts = phoneContacts?.filter((contact: any) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNext = (phoneNumber: string, recipient: string, countryCode: string) => {
    setTransactionData({
      recipientPhone: (countryCode + phoneNumber).replace(/[\s()-]/g, ''),
      recipientName: recipient,
      amount: '0',
      token: 'USDc',
    });
    router.push('/send/enterAmount');
  };

  const dropdownRef = useRef<ModalDropdown | null>(null);

  const close = useCallback(() => {
    addContactRef.current?.close();
    isActionTrayOpened.value = false;
  }, []);

  const toggleBottomSheet = useToggleBottomSheet(addContactRef, isActionTrayOpened, close);

  const { keyboardBottomSheetAdjustment } = useKeyboardBottomSheetAdjustment(addContactRef);

  const rContentStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(SCREEN_HEIGHT > 700 ? 700 : SCREEN_HEIGHT - 80, {
        damping: 20,
      }),
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <Text style={styles.title}>{i18n.t('sendSelectContactTitle')}</Text>
          <ContactForm
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            name={recipient}
            setName={setRecipient}
            handleOpenKeyboard={keyboardBottomSheetAdjustment}
            selectContact={() => {
              getPhoneContacts();
              toggleBottomSheet();
            }}
          />
          <View style={styles.buttonWrapper}>
            <Link href="/send/enterAmount" asChild>
              <Button
                title={i18n.t('next')}
                type="primary"
                onPress={() => handleNext(phoneNumber, recipient, countryCode)}
                disabled={!phoneNumber}
              />
            </Link>
          </View>
        </View>
        <BottomSheet ref={addContactRef}>
          <Animated.View style={rContentStyle}>
            <Animated.View
              layout={Layout.easing(Easing.linear).duration(250)}
              exiting={FadeOut.delay(100)}
              style={{ flex: 1, backgroundColor: COLORS.gray[800] }}>
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
                        setName={setRecipient}
                        countryCodes={countryCodes}
                        dropdownRef={dropdownRef}
                        close={close}
                      />
                    )}
                  />
                </View>
              </View>
            </Animated.View>
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
    paddingBottom: 40,
    paddingHorizontal: minMaxScale(12, 16),
  },
  selectContactButton: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 8,
  },
  selectContactButtonText: {
    color: COLORS.primary[600],
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
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
  modalText: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginTop: 16,
    marginBottom: 32,
  },
});
