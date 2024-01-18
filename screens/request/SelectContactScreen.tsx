import { Feather } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
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
  const ref = useRef<BottomSheetRefProps>(null);
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
        ref.current?.close();
        // Remove the listener once done
        keyboardDidHideListener.remove();
      });

      // Dismiss the keyboard
      Keyboard.dismiss();
    }
  }, [name, phoneNumber]);

  const handleOpenBottomSheet = useCallback(() => {
    const isActive = ref.current?.isActive();
    if (isActive) {
      ref.current?.scrollTo(0);
    } else {
      ref.current?.scrollTo(-550);
    }
  }, []);

  const handleOpenKeyboard = useCallback(() => {
    const isActive = ref.current?.isActive();
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
      if (isActive) {
        ref.current?.scrollTo(-550 - e.endCoordinates.height);
      }
    });
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      ref.current?.scrollTo(-550);
    });

    // Cleanup listeners on unmount
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
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
            <FlatList
              data={contacts}
              renderItem={({ item }) => <Text style={{ color: COLORS.light }}>{item.name}</Text>}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Next" type="primary" onPress={() => handleNext()} />
          </View>
        </View>
        <BottomSheet ref={ref}>
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
  contact: {
    gap: 10,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[400],
  },
  contactName: {
    color: COLORS.dark,
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
  },
  contactNumber: {
    color: COLORS.dark,
    fontSize: 20,
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
