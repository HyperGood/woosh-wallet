import { StyleSheet, Text, View } from 'react-native';
import IconButton from './UI/IconButton';
import { COLORS } from '../constants/global-styles';
const Balance = () => {
  const handleButton = () => {
    console.log('hi');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.number}>
        $100.<Text style={styles.decimal}>00</Text>
      </Text>
      <View style={styles.buttonContainer}>
        <IconButton icon="plus" onPress={handleButton} />
      </View>
    </View>
  );
};
export default Balance;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 56,
  },
  number: {
    fontSize: 88,
    fontFamily: 'FHOscar',
    color: COLORS.light,
  },
  decimal: {
    fontSize: 48,
    fontFamily: 'FHOscar',
  },
  buttonContainer: {
    paddingBottom: 16,
  },
});
