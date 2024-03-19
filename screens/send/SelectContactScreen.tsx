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
import { normalize } from 'viem/ens';

import ContactSelector from '../../components/ContactSelector';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import PageHeader from '../../components/UI/PageHeader';
import SearchInput from '../../components/UI/SearchInput';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import ContactListItem from '../../components/request/ContactListItem';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import publicClient from '../../constants/viemPublicClient';
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
  address?: string;
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
  const [isSearching, setIsSearching] = useState(false);
  const countryCodes = ['+52', '+1'];

  useEffect(() => {
    const fetchAddressFromENS = async (input: string) => {
      const addressFromENS = await publicClient.getEnsAddress({
        name: normalize(searchInput),
      });
      return addressFromENS
        ? [{ id: addressFromENS, address: addressFromENS, name: searchInput }]
        : [];
    };

    const fetchUsersByField = async (field: string) => {
      const querySnapshot = await firestore()
        .collection('users')
        .where(field, '>=', searchInput)
        .where(field, '<=', searchInput + '\uf8ff')
        .get();
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const fetchUsers = async () => {
      setIsSearching(true);
      if (searchInput.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      let results = [];
      if (searchInput.endsWith('.eth')) {
        results = await fetchAddressFromENS(searchInput);
      } else {
        const usernameResults = await fetchUsersByField('username');
        const nameResults = await fetchUsersByField('name');
        const combinedResults = [...usernameResults, ...nameResults];
        results = Array.from(new Map(combinedResults.map((user) => [user.id, user])).values());
      }

      setSearchResults(results);
      setIsSearching(false);
    };

    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [searchInput]);

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

  const rContentStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(SCREEN_HEIGHT > 700 ? 700 : SCREEN_HEIGHT - 80, {
        damping: 20,
      }),
    };
  }, []);

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

  function formatContactDisplay(item: Contact): string {
    if (item.phoneNumber) {
      return item.phoneNumber;
    }
    if (item.username) {
      return item.username;
    }
    if (item.address) {
      return `${item.address.slice(0, 4)}...${item.address.slice(-4)}`;
    }
    return '';
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <View style={{ flex: 1 }}>
        <PageHeader pageTitle="Send Funds" />
        <View style={{ flex: 1, justifyContent: 'space-between', gap: 24 }}>
          <View style={{ gap: 8 }}>
            <Text style={styles.title}>{i18n.t('sendSelectContactTitle')}</Text>
            <Text style={{ color: COLORS.gray[400], fontFamily: 'Satoshi-Regular', fontSize: 17 }}>
              Send funds to anyone in the world, instantly for free, even if they don&apos;t have an
              account.
            </Text>
          </View>
          <SearchInput
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            isSearching={isSearching}
          />
        </View>
      </View>
      <FlashList
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={{ marginTop: 24 }}
        data={
          searchInput !== '' && searchResults
            ? [{ id: 'resultsTitle', component: renderTitle('Search Results') }, ...searchResults]
            : data
        }
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={100}
        renderItem={({ item, index }) => {
          if (isItemWithComponent(item)) {
            return (
              <View
                style={[
                  styles.itemWrapper,
                  {
                    paddingTop: index === 0 ? 24 : 16,
                    borderTopLeftRadius: index === 0 ? 24 : 0,
                    borderTopRightRadius: index === 0 ? 24 : 0,
                  },
                ]}>
                {item.component}
              </View>
            );
          } else {
            return (
              <View
                style={[
                  styles.itemWrapperNoTopPadding,
                  {
                    paddingBottom: index === currentDataLength ? 16 : 0,
                    borderBottomLeftRadius: index === currentDataLength ? 24 : 0,
                    borderBottomRightRadius: index === currentDataLength ? 24 : 0,
                  },
                ]}>
                <ContactListItem
                  name={item.name ? item.name : 'Unknown'}
                  phoneNumber={formatContactDisplay(item)}
                />
                {index !== currentDataLength && <View style={styles.separator} />}
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
  // Added styles
  itemWrapper: {
    paddingTop: 24,
    paddingHorizontal: 8,
    backgroundColor: COLORS.gray[800],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  itemWrapperNoTopPadding: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.gray[800],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.light,
    opacity: 0.05,
    width: '75%',
    alignSelf: 'center',
  },
});
