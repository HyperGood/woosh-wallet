import { StyleSheet, Text, View } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { COLORS } from '../../constants/global-styles';

interface SelectContactProps {
  onNext: () => void;
}

const SelectContact = ({ onNext }: SelectContactProps) => {
  return (
    <View style={styles.wrapper}>
      <BackButton />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.title}>A quien le enviaras?</Text>
          <Input placeholder="Enter a phone number" onChangeText={() => {}} value="" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Next" type="primary" onPress={onNext} />
        </View>
      </View>
    </View>
  );
};
export default SelectContact;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
    marginHorizontal: 32,
    marginBottom: 16,
  },
  buttonWrapper: {
    marginTop: 24,
    flexDirection: 'row',
    marginHorizontal: 12,
  },
});
