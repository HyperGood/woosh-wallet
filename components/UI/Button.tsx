import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/global-styles';
import { Feather } from '@expo/vector-icons';

interface ButtonProps {
  onPress: () => void;
  title: string;
  type?: 'primary';
  icon?: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, title, type, icon }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.buttonContainer, type === 'primary' && styles.primaryButton]}>
      <Text style={[styles.buttonText, type === 'primary' && styles.primaryText]}>{title}</Text>
      {icon && (
        <Feather name={icon} size={16} color={type === 'primary' ? COLORS.light : COLORS.dark} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 50,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  buttonText: {
    fontSize: 24,
    color: COLORS.dark,
    fontFamily: 'Satoshi-Bold',
    alignSelf: 'center',
  },
  primaryButton: {
    elevation: 8,
    shadowColor: '#09EE49',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    backgroundColor: COLORS.primary[400],
  },
  primaryText: {
    color: COLORS.light,
  },
});

export default Button;
