import { Link, router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ContactSelector from '../../components/ContactSelector';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import PageHeader from '../../components/UI/PageHeader';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import ContactListItem from '../../components/request/ContactListItem';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useKeyboardBottomSheetAdjustment } from '../../hooks/BottomSheet/useKeyboardBottomSheetAdjustment';
import { useToggleBottomSheet } from '../../hooks/BottomSheet/useToggleBottomSheet';
import { usePhoneContacts } from '../../store/ContactsContext';
import { useTransaction } from '../../store/TransactionContext';
import { minMaxScale } from '../../utils/scalingFunctions';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const SelectContactScreen = () => {
  const insets = useSafeAreaInsets();
  const addContactRef = useRef<BottomSheetRefProps>(null);
  const { setTransactionData } = useTransaction();
  const { phoneContacts, getPhoneContacts } = usePhoneContacts();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+52'); // default to US
  const [recipient, setRecipient] = useState('');
  const [searchText, setSearchText] = useState('');
  const isActionTrayOpened = useSharedValue(false);
  const [searchInput, setSearchInput] = useState('');

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

  const renderHeader = () => (
    <View>
      <PageHeader pageTitle="Send Funds" />
      <View style={{ flex: 1, justifyContent: 'space-between', gap: 24 }}>
        <View style={{ gap: 8 }}>
          <Text style={styles.title}>{i18n.t('sendSelectContactTitle')}</Text>
          <Text style={{ color: COLORS.gray[400], fontFamily: 'Satoshi-Regular', fontSize: 17 }}>
            Send funds to anyone in the world, instantly for free, even if they don&apos;t have an
            account.
          </Text>
        </View>
        <Input
          placeholder="Username, ETH address, or ENS"
          value={searchInput}
          onChangeText={setSearchInput}
          icon
        />
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.buttonWrapper}>
      <Link href="/send/enterAmount" asChild>
        <Button
          title={i18n.t('next')}
          type="secondary"
          onPress={() => handleNext(phoneNumber, recipient, countryCode)}
        />
      </Link>
    </View>
  );

  const renderRecentTitle = () => (
    <Text style={{ fontSize: 14, fontFamily: 'Satoshi-Bold', color: COLORS.light, opacity: 0.6 }}>
      Recents
    </Text>
  );

  const data = [
    {
      id: 'selectContact',
      component: (
        <Pressable
          style={styles.selectContactButton}
          onPress={() => {
            getPhoneContacts();
            toggleBottomSheet();
          }}>
          <Image
            source={require('../../assets/images/contacts-icon.png')}
            style={{ width: 32, height: 32 }}
          />
          <Text style={styles.selectContactButtonText}>{i18n.t('getContacts')}</Text>
        </Pressable>
      ),
    },
    { id: 'recentTitle', component: renderRecentTitle() },
    { name: 'Alice', phoneNumber: '+123456789' },
    { name: 'Bob', phoneNumber: '+987654321' },
    { name: 'Charlie', phoneNumber: '+192837465' },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <FlatList
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ marginBottom: 24 }}
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={{ marginTop: 24 }}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) =>
          item.component ? (
            <View
              style={{
                paddingTop: index === 0 ? 24 : 16,
                paddingHorizontal: 8,
                backgroundColor: COLORS.gray[800],
                borderTopLeftRadius: index === 0 ? 24 : 0,
                borderTopRightRadius: index === 0 ? 24 : 0,
              }}>
              {item.component}
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: 8,
                paddingBottom: index === data.length - 1 ? 16 : 0,
                backgroundColor: COLORS.gray[800],
                borderBottomLeftRadius: index === data.length - 1 ? 24 : 0,
                borderBottomRightRadius: index === data.length - 1 ? 24 : 0,
              }}>
              <ContactListItem name={item.name} phoneNumber={item.phoneNumber} />
              {index !== data.length - 1 && (
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
            </View>
          )
        }
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: 24,
          paddingHorizontal: minMaxScale(12, 16),
        }}
      />

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
    </GestureHandlerRootView>
  );
};
export default SelectContactScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
  },
  selectContactButton: {
    backgroundColor: COLORS.light,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectContactButtonText: {
    color: COLORS.gray[600],
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
