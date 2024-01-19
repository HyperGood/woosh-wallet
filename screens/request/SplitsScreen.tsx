import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Button from '../../components/UI/Button';
import InnerHeader from '../../components/UI/InnerHeader';
import ContactListItem from '../../components/request/ContactListItem';
import { COLORS } from '../../constants/global-styles';
import { useRequest } from '../../store/RequestContext';

const SplitsScreen = () => {
  const { requestData, setRequestData } = useRequest();

  const handleAmountChange = useCallback(
    (index: number, newAmount: string) => {
      setRequestData((prevData) => {
        if (prevData === null) return null;
        const newContacts = [...(prevData?.contacts || [])];
        newContacts[index].amount = parseFloat(newAmount);
        return {
          ...prevData,
          contacts: newContacts,
          recipientAddress: prevData?.recipientAddress || '',
        };
      });
    },
    [setRequestData]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.wrapper}>
        <InnerHeader title="Request" />

        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.title}>Total</Text>
            <Text style={styles.title}>$100.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.title}>From: </Text>
            <Pressable>
              <Text style={styles.title}>Equal Split</Text>
            </Pressable>
          </View>
        </View>

        {requestData?.contacts && requestData.contacts?.length > 0 && (
          <FlatList
            data={requestData?.contacts}
            renderItem={({ item, index }) => (
              <ContactListItem
                name={item.name}
                phoneNumber={item.phoneNumber}
                // Pass editableAmount and amount if you want to show and edit the amount
                editableAmount
                amount={item.amount.toString()}
                onAmountChange={(newAmount) => handleAmountChange(index, newAmount)}
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
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <Button title="Send Request" type="primary" onPress={() => {}} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default SplitsScreen;
const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[600],
    marginHorizontal: 16,
    marginTop: 16,
  },
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
    fontSize: 32,
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
