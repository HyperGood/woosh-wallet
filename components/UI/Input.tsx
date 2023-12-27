import { TextInput, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';

//Add props
interface InputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
}

const Input = ({ placeholder, onChangeText, value }: InputProps) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      placeholderTextColor={COLORS.gray[400]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.gray[600],
    borderRadius: 16,
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginHorizontal: 16,
    color: COLORS.light,
  },
});

export default Input;
