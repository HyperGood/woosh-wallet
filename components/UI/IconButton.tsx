import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';

interface IconButtonProps {
  onPress: () => void;
  icon?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onPress, icon }) => {
  return (
    <Pressable onPress={onPress} style={styles.buttonContainer}>
      {icon && <Feather name={icon} size={16} color={COLORS.dark} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconButton;
