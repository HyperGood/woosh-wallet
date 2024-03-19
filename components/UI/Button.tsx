import { Feather } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';

interface ButtonProps {
  onPress: () => void;
  title: string;
  type?: 'primary' | 'secondary';
  icon?: string;
  swapIcon?: boolean;
  disabled?: boolean;
}

const Button = forwardRef((props: ButtonProps, ref) => {
  const { onPress, title, type, icon, swapIcon = false, disabled } = props;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.buttonContainer,
        type === 'primary' && styles.primaryButton,
        !disabled &&
          type === 'primary' && {
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
        type === 'secondary' && styles.secondaryButton,
        disabled && { backgroundColor: COLORS.gray[600] },
      ]}>
      <Text
        style={[
          styles.buttonText,
          type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText,
        ]}>
        {title}
      </Text>
      {icon && (
        <Feather
          name={icon as any}
          size={20}
          color={type === 'primary' ? COLORS.light : COLORS.dark}
        />
      )}
    </Pressable>
  );
});

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
    flex: 1,
  },
  swapIcon: {
    flexDirection: 'row-reverse',
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'Satoshi-Medium',
    alignSelf: 'center',
    lineHeight: 24,
  },
  primaryButtonText: {
    color: COLORS.light,
  },
  secondaryButtonText: {
    color: COLORS.dark,
  },
  primaryButton: {
    backgroundColor: COLORS.dark,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary[400],
  },
});

export default Button;
