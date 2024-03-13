import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SettingsOptionProps {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
}

const SettingsOption = ({ icon, label, onPress, color }: SettingsOptionProps) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Feather name={icon} size={24} color={color} style={styles.logo} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default SettingsOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
  },
  logo: {
    paddingHorizontal: 8,
  },
  label: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    paddingLeft: 8,
    fontSize: 24,
    textAlignVertical: 'center',
  },
});
