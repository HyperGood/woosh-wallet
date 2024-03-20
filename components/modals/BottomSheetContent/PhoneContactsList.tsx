import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import type { Contact } from 'expo-contacts';
import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Animated, { Easing, FadeOut, Layout } from 'react-native-reanimated';

import ContactListItem from '../../request/ContactListItem';
import Input from '../../UI/Input';
import i18n from '../../../constants/i18n';
import { COLORS } from '../../../constants/global-styles';

type PhoneContactsListProps = {
  filteredContacts: Contact[] | undefined;
  setSearchText: (text: string) => void;
  searchText: string;
  handleItemPress: (item: Contact) => void;
  onBackPress?: () => void;
};

const PhoneContactsList: React.FC<PhoneContactsListProps> = ({
  filteredContacts,
  setSearchText,
  searchText,
  handleItemPress,
  onBackPress,
}) => {
  return (
    <Animated.View
      layout={Layout.easing(Easing.linear).duration(250)}
      exiting={FadeOut.delay(100)}
      style={{ flex: 1, backgroundColor: COLORS.gray[800] }}>
      {onBackPress ? (
        <Pressable
          style={{ marginLeft: 16, position: 'absolute', padding: 8 }}
          onPress={onBackPress}>
          <Feather name="arrow-left" size={24} color={COLORS.light} />
        </Pressable>
      ) : null}
      <Text style={styles.modalText}>{i18n.t('addContact')}</Text>
      <View style={{ gap: 24, paddingHorizontal: 16, flex: 1 }}>
        <View style={{ flex: 1, gap: 24 }}>
          <Input
            placeholder={i18n.t('searchContacts')}
            onChangeText={setSearchText}
            value={searchText}
            icon
          />
          <View style={styles.phoneContactsContainer}>
            <FlashList
              data={filteredContacts}
              keyExtractor={(item, index) => (item.id ? item.id : index.toString())}
              estimatedItemSize={100}
              ListEmptyComponent={<Text>No contacts found on your phone</Text>}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleItemPress(item)}>
                  <ContactListItem
                    name={item.name}
                    phoneNumber={item.phoneNumbers![0].number || ''}
                  />
                </Pressable>
              )}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default PhoneContactsList;

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: COLORS.light,
    opacity: 0.05,
    width: '75%',
    alignSelf: 'center',
  },
  phoneContactsContainer: {
    backgroundColor: COLORS.gray[600],
    paddingTop: 16,
    paddingHorizontal: 10,
    borderRadius: 24,
    flex: 1,
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
