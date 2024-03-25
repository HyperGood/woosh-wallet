import { FlashList } from '@shopify/flash-list';
import * as Contacts from 'expo-contacts';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchUsersByField } from '../../api/firestoreService';
import PageHeader from '../../components/UI/PageHeader';
import SearchInput from '../../components/UI/SearchInput';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import PhoneContactsList from '../../components/modals/BottomSheetContent/PhoneContactsList';
import ContactListItem from '../../components/request/ContactListItem';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useToggleBottomSheet } from '../../hooks/BottomSheet/useToggleBottomSheet';
import { usePhoneContacts } from '../../store/ContactsContext';
import { useTransaction } from '../../store/TransactionContext';
import { fetchAddressFromENS } from '../../utils/ethereumUtils';
import { minMaxScale } from '../../utils/scalingFunctions';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type Contact = {
  id: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
  ethAddress?: string;
};

type ItemWithComponent = {
  id: string;
  component: React.ReactNode;
};

type Item = Contact | ItemWithComponent;

const EnterRecipientScreen = () => {
  const insets = useSafeAreaInsets();
  const addContactRef = useRef<BottomSheetRefProps>(null);
  const { setTransactionData } = useTransaction();
  const { phoneContacts, getPhoneContacts } = usePhoneContacts();
  const [searchText, setSearchText] = useState('');
  const isActionTrayOpened = useSharedValue(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
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
      } else if (searchInput.startsWith('0x') && searchInput.length === 42) {
        results = [{ id: searchInput, ethAddress: searchInput }];
      } else {
        const usernameResults = await fetchUsersByField('username', searchInput.toLowerCase());
        const nameResults = await fetchUsersByField('name', searchInput);
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

  const closeBottomSheet = useCallback(() => {
    addContactRef.current?.close();
    isActionTrayOpened.value = false;
  }, []);

  const toggleBottomSheet = useToggleBottomSheet(
    addContactRef,
    isActionTrayOpened,
    closeBottomSheet
  );

  const rContentStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(SCREEN_HEIGHT > 700 ? 700 : SCREEN_HEIGHT - 80, {
        damping: 20,
      }),
    };
  }, []);

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
    if (item.name && item.ethAddress) {
      return `${item.ethAddress.slice(0, 4)}...${item.ethAddress.slice(-4)}`;
    }
    return item.ethAddress ? item.ethAddress : '';
  }

  function isExpoContact(item: Contact | Contacts.Contact): item is Contacts.Contact {
    return 'phoneNumbers' in item;
  }

  const handleItemPress = (item: Contact | Contacts.Contact) => {
    if ('ethAddress' in item) {
      setTransactionData({
        recipientName: item.name || '',
        recipientInfo: item.ethAddress || '',
        type: 'ethAddress',
      });
    } else {
      let phoneNumber = '';
      if (isExpoContact(item)) {
        phoneNumber = item.phoneNumbers?.[0]?.number || '';
      } else {
        phoneNumber = item.phoneNumber || '';
      }
      setTransactionData({
        recipientName: item.name || '',
        recipientInfo: phoneNumber,
        type: 'depositVault',
      });
    }
    router.push('/(tabs)/(home)/send/enterAmount');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: 16,
          paddingHorizontal: minMaxScale(12, 16),
        }}>
        <PageHeader pageTitle="Send Funds" />
        <View style={{ gap: 24 }}>
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
        data={
          searchInput !== '' && searchResults
            ? [{ id: 'resultsTitle', component: renderTitle('Search Results') }, ...searchResults]
            : data
        }
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={20}
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
                    paddingBottom: index === currentDataLength - 1 ? 24 : 0,
                    borderBottomLeftRadius: index === currentDataLength - 1 ? 24 : 0,
                    borderBottomRightRadius: index === currentDataLength - 1 ? 24 : 0,
                  },
                ]}>
                {item.component}
              </View>
            );
          } else {
            return (
              <Pressable
                style={[
                  styles.itemWrapperNoTopPadding,
                  {
                    paddingBottom: index === currentDataLength ? 16 : 0,
                    borderBottomLeftRadius: index === currentDataLength ? 24 : 0,
                    borderBottomRightRadius: index === currentDataLength ? 24 : 0,
                  },
                ]}
                onPress={() => handleItemPress(item)}>
                <ContactListItem
                  name={item.name ? item.name : 'No name'}
                  phoneNumber={formatContactDisplay(item)}
                />
                {index !== currentDataLength && <View style={styles.separator} />}
              </Pressable>
            );
          }
        }}
        contentContainerStyle={{
          paddingHorizontal: minMaxScale(12, 16),
        }}
      />

      <BottomSheet ref={addContactRef}>
        <Animated.View style={rContentStyle}>
          <PhoneContactsList
            filteredContacts={filteredContacts}
            setSearchText={setSearchText}
            searchText={searchText}
            handleItemPress={handleItemPress}
          />
        </Animated.View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};
export default EnterRecipientScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
  },
  selectContactButton: {
    backgroundColor: '#535355',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectContactButtonText: {
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
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
