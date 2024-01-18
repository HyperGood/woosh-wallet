import { Feather } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import PhoneNumberInput from '../../components/UI/PhoneNumberInput';
import BottomSheet, { BottomSheetRefProps } from '../../components/modals/BottomSheet';
import { COLORS } from '../../constants/global-styles';
import { useRequest } from '../../store/RequestContext';

const SelectContactScreen = () => {
  const ref = useRef<BottomSheetRefProps>(null);
  const { requestData } = useRequest();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [name, setName] = useState('');

  const handleNext = () => {
    console.log(requestData);
  };

  const handleOpenBottomSheet = useCallback(() => {
    const isActive = ref.current?.isActive();
    if (isActive) {
      ref.current?.scrollTo(0);
    } else {
      ref.current?.scrollTo(-550);
      console.log('inactive');
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
      <View style={styles.wrapper}>
        <BackButton />
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
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
            <Text style={{ color: COLORS.primary[400], fontFamily: 'Satoshi-Bold', fontSize: 18 }}>
              Add a contact
            </Text>
          </Pressable>
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
              <Button title="Add" type="primary" onPress={() => {}} />
            </View>
          </View>
        </BottomSheet>
      </View>
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
});
