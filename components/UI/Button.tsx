import { Feather } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';

interface ButtonProps {
  onPress: () => void;
  title: string;
  type?: 'primary' | 'secondary' | 'destructive' | 'main';
  icon?: string;
  swapIcon?: boolean;
  disabled?: boolean;
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  swapIcon: {
    flexDirection: 'row-reverse',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Satoshi-Medium',
    alignSelf: 'center',
    lineHeight: 24,
  },
  lightButtonText: {
    color: COLORS.light,
  },
  darkButtonText: {
    color: COLORS.dark,
  },
  primaryButton: {
    backgroundColor: COLORS.dark,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary[400],
  },
  destructiveButton: {
    backgroundColor: '#ED2038',
  },
  mainButton: {
    backgroundColor: COLORS.primary[400],
  },
});

const buttonTypeStyles = {
  primary: styles.primaryButton,
  secondary: styles.secondaryButton,
  destructive: styles.destructiveButton,
  main: styles.mainButton,
};

const Button = forwardRef((props: ButtonProps, ref) => {
  const { onPress, title, type = 'primary', icon, swapIcon = false, disabled } = props;

  const baseButtonStyle = buttonTypeStyles[type] || styles.primaryButton;

  const buttonStyle = [
    styles.buttonContainer,
    baseButtonStyle,
    disabled && { backgroundColor: COLORS.gray[600] },
    !disabled &&
      type === 'main' && {
        elevation: 8,
        shadowColor: '#09EE49',
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: {
          width: 0,
          height: 5,
        },
      },
    swapIcon && styles.swapIcon,
  ];

  return (
    <Pressable onPress={onPress} disabled={disabled} style={buttonStyle}>
      <Text
        style={[
          styles.buttonText,
          type === 'primary' || type === 'destructive'
            ? styles.lightButtonText
            : styles.darkButtonText,
        ]}>
        {title}
      </Text>
      {icon && (
        <Feather
          name={icon as any}
          size={20}
          color={type === 'primary' || type === 'destructive' ? COLORS.light : COLORS.dark}
        />
      )}
    </Pressable>
  );
});

export default Button;
