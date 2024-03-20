import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useRef } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Button from '../../components/UI/Button';
import ContactListItem from '../../components/request/ContactListItem';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useRequest } from '../../store/RequestContext';

const SplitsScreen = () => {
  const { requestData, setRequestData } = useRequest();
  const originalTotalAmount = useRef(requestData?.totalAmount || 1); // Store the original total amount

  const totalAmount = requestData?.totalAmount || 1;

  const handleAmountChange = useCallback(
    (index: number, newAmount: string) => {
      setRequestData((prevData) => {
        if (prevData === null) return null;
        const newContacts = [...(prevData?.contacts || [])];
        newContacts[index].amount = newAmount.endsWith('.')
          ? newAmount
          : newAmount === ''
            ? 0
            : parseFloat(newAmount);

        // Calculate the new total amount
        const newTotalAmount = newContacts.reduce(
          (total, contact) =>
            total +
            (typeof contact.amount === 'string' ? parseFloat(contact.amount) : contact.amount),
          0
        );

        return {
          ...prevData,
          contacts: newContacts,
          totalAmount: newTotalAmount, // Update the total amount
          recipientAddress: prevData?.recipientAddress || '',
        };
      });
    },
    [setRequestData]
  );

  const handleUndo = useCallback(() => {
    setRequestData((prevData) => {
      if (prevData === null) return null;
      const newContacts = [...(prevData?.contacts || [])];

      // Divide the original total amount equally among all contacts
      const equalAmount = (originalTotalAmount.current / newContacts.length).toFixed(2);
      newContacts.forEach((contact) => (contact.amount = equalAmount));

      return {
        ...prevData,
        contacts: newContacts,
        totalAmount: originalTotalAmount.current, // Revert to the original total amount
      };
    });
  }, [setRequestData]);

  const handleSendRequest = useCallback(() => {
    console.log('Send request with data', requestData);
    try {
      firestore()
        .collection('requests')
        .add({
          ...requestData,
        })
        .then(() => {
          router.push('/request/success');
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.wrapper}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 16,
          }}>
          <Text style={styles.title}>Total</Text>
          <Text style={styles.titleNumber}>
            ${totalAmount ? Number(totalAmount).toFixed(2) : '0.00'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 16,
            marginTop: 24,
          }}>
          <Text style={styles.subTitle}>{i18n.t('from')}: </Text>
          <Pressable onPress={handleUndo}>
            <Text style={styles.undo}>{i18n.t('undo')}</Text>
          </Pressable>
        </View>

        {requestData?.contacts && requestData.contacts?.length > 0 && (
          <FlatList
            data={requestData?.contacts}
            renderItem={({ item, index }) => (
              <ContactListItem
                name={item.name}
                phoneNumber={item.phoneNumber}
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
        <View style={{ flexDirection: 'row', marginTop: 16, paddingHorizontal: 16 }}>
          <Button
            title={i18n.t('sendRequest')}
            icon="send"
            type="secondary"
            onPress={handleSendRequest}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default SplitsScreen;
const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: COLORS.light,
    opacity: 0.05,
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
  },
  subTitle: {
    fontSize: 24,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
  },
  titleNumber: {
    fontSize: 32,
    color: COLORS.light,
    fontFamily: 'FHOscar',
    letterSpacing: -0.02,
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
  undo: {
    fontSize: 18,
    color: COLORS.gray[400],
    fontFamily: 'Satoshi-Bold',

    //underline text
    textDecorationLine: 'underline',
  },
});
