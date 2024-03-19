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
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  handleOpenKeyboard?: () => void;
}

const Input = ({
  placeholder,
  onChangeText,
  value,
  theme = 'dark',
  icon,
  keyboardType = 'default',
  handleOpenKeyboard,
}: InputProps) => {
  const [isActive, setIsActive] = useState(false);
  const inputStyle = [
    icon ? { paddingLeft: 48 } : { paddingLeft: 16 },
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
        placeholderTextColor="#A9ABAC"
        onFocus={() => {
          setIsActive(true);
          handleOpenKeyboard && handleOpenKeyboard();
        }}
        onBlur={() => setIsActive(false)}
        keyboardType={keyboardType}
        returnKeyType="done"
      />
      {icon ? <Feather name="search" size={24} color={COLORS.light} style={styles.icon} /> : null}
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
    fontSize: 17,
    paddingRight: 16,
    paddingVertical: 24,
    color: COLORS.dark,
  },
  darkInput: {
    backgroundColor: COLORS.gray[600],
    borderRadius: 16,
    fontSize: 17,
    paddingRight: 16,
    paddingVertical: 24,
    color: COLORS.light,
    borderWidth: 2,
    borderColor: COLORS.gray[600],
  },
  icon: {
    position: 'absolute',
    left: 16,
    opacity: 0.6,
  },
  active: {
    borderColor: COLORS.primary[400],
    borderWidth: 2,
  },
});

export default Input;
