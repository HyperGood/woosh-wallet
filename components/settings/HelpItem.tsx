import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface HelpItemProps {
  label: string;
  answer: string;
  onPress: () => void;
}

const HelpItem = ({ label, answer, onPress }: HelpItemProps) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Feather name={'help-circle'} size={24} color={'#00A3FF'} style={styles.logo} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.answer}>{answer}</Text>
      </View>
    </Pressable>
  );
};

export default HelpItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    alignItems: 'center',
  },
  logo: {
    paddingHorizontal: 8,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  title: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 24,
    textAlignVertical: 'center',
  },
  answer: {
    fontFamily: 'Satoshi',
    fontWeight: '500',
    fontSize: 17,
    textAlignVertical: 'center',
  },
});
