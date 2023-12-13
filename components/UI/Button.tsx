import { Feather } from '@expo/vector-icons';
import { Pressable, Text, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';

interface ButtonProps {
  onPress: () => void;
  title: string;
  type?: 'primary' | 'secondary';
  icon?: string;
  swapIcon?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onPress, title, type, icon, swapIcon = false }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.buttonContainer,
        type === 'primary' && styles.primaryButton,
        swapIcon && styles.swapIcon,
        type === 'secondary' && styles.secondaryButton,
      ]}>
      <Text style={styles.buttonText}>{title}</Text>
      {icon && <Feather name={icon as any} size={20} color={COLORS.dark} />}
    </Pressable>
  );
};

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
    color: COLORS.dark,
    fontFamily: 'Satoshi-Bold',
    alignSelf: 'center',
    lineHeight: 24,
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
  secondaryButton: {
    backgroundColor: COLORS.secondary[400],
  },
});

export default Button;
