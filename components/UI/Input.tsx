import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

import { COLORS } from '../../constants/global-styles';

//Add props
interface InputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  theme?: 'light' | 'dark';
  icon?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'; // Added keyboardType prop
}

const Input = ({
  placeholder,
  onChangeText,
  value,
  theme = 'dark',
  icon,
  keyboardType = 'default',
}: InputProps) => {
  const [isActive, setIsActive] = useState(false);
  const inputStyle = [
    theme === 'light' ? styles.lightInput : styles.darkInput,
    isActive ? styles.active : {},
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        placeholderTextColor={COLORS.gray[400]}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        keyboardType={keyboardType}
      />
      {icon ? <Feather name="search" size={24} color="black" style={styles.icon} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  lightInput: {
    backgroundColor: COLORS.light,
    borderRadius: 16,
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginHorizontal: 16,
    color: COLORS.dark,
  },
  darkInput: {
    backgroundColor: COLORS.gray[800],
    borderRadius: 16,
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginHorizontal: 16,
    color: COLORS.light,
    borderWidth: 2,
    borderColor: COLORS.gray[800],
  },
  icon: {
    position: 'absolute',
    right: 40,
    opacity: 0.6,
  },
  active: {
    borderColor: COLORS.primary[400],
    borderWidth: 2,
  },
});

export default Input;
