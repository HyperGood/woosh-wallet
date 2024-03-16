import firestore from '@react-native-firebase/firestore';
import { FlashList } from '@shopify/flash-list';
import { Link, router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
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

type Contact = {
  id: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
};

type ItemWithComponent = {
  id: string;
  component: React.ReactNode;
};

type Item = Contact | ItemWithComponent;

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
  const [searchResults, setSearchResults] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchInput.trim() === '') {
        setSearchResults([]);
        return;
      }

      // Query for usernames
      const usernameQuerySnapshot = await firestore()
        .collection('users')
        .where('username', '>=', searchInput)
        .where('username', '<=', searchInput + '\uf8ff')
        .get();

      // Query for names
      const nameQuerySnapshot = await firestore()
        .collection('users')
        .where('name', '>=', searchInput)
        .where('name', '<=', searchInput + '\uf8ff')
        .get();

      // Combine and map the results from both queries
      const combinedResults = [...usernameQuerySnapshot.docs, ...nameQuerySnapshot.docs].map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      // Remove duplicates (assuming 'id' is unique for each user)
      const uniqueResults = Array.from(
        new Map(combinedResults.map((user) => [user.id, user])).values()
      );

      setSearchResults(uniqueResults);
    };

    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

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

  const renderTitle = (title: string) => (
    <Text style={{ fontSize: 14, fontFamily: 'Satoshi-Bold', color: COLORS.light, opacity: 0.6 }}>
      {title}
    </Text>
  );

  const data: Item[] = [
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
    { id: 'recentTitle', component: renderTitle('Recents') },
    { id: '123456789', name: 'Alice', phoneNumber: '+123456789' },
    { id: '987654321', name: 'Bob', phoneNumber: '+987654321' },
    { id: '192837465', name: 'Charlie', phoneNumber: '+192837465' },
  ];

  const currentDataLength =
    searchInput !== '' && searchResults.length > 0 ? searchResults.length : data.length;

  function isItemWithComponent(item: Item): item is ItemWithComponent {
    return (item as ItemWithComponent).component !== undefined;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <FlashList
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ marginBottom: 24 }}
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={{ marginTop: 24 }}
        data={
          searchInput !== '' && searchResults
            ? [
                { id: 'resultsTitle', component: renderTitle('Other Woosh Users') },
                ...searchResults,
              ]
            : data
        }
        keyExtractor={(item, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        estimatedItemSize={100}
        renderItem={({ item, index }) => {
          if (isItemWithComponent(item)) {
            return (
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
            );
          } else {
            return (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingBottom: index === currentDataLength ? 16 : 0,
                  backgroundColor: COLORS.gray[800],
                  borderBottomLeftRadius: index === currentDataLength ? 24 : 0,
                  borderBottomRightRadius: index === currentDataLength ? 24 : 0,
                }}>
                <ContactListItem
                  name={item.name ? item.name : 'Unknown'}
                  phoneNumber={
                    item.phoneNumber ? item.phoneNumber : item.username ? item.username : ''
                  }
                />
                {index !== currentDataLength && (
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
            );
          }
        }}
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
