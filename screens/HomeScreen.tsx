import { ScrollView, StyleSheet, View } from 'react-native';

import Balance from '../components/Balance';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import PreviousTransactions from '../components/transactions/UI/PreviousTransactions';
import { COLORS } from '../constants/global-styles';

const HomeScreen = () => {
  const handleButton = () => {
    console.log('hi');
  };
  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        <Header />

        <Balance />
        <View style={styles.buttonsContainer}>
          <Button
            title="Cobrar"
            icon="arrow-down-left"
            type="secondary"
            swapIcon
            onPress={handleButton}
          />
          <Button title="Enviar" icon="send" type="primary" onPress={handleButton} />
        </View>
        <PreviousTransactions />
      </View>
    </ScrollView>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 72,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 80,
    paddingHorizontal: 12,
  },
});
