import { ScrollView, StyleSheet, View } from 'react-native';

import Button from '../components/UI/Button';
import { COLORS } from '../constants/global-styles';
import Header from '../components/UI/Header';
import Balance from '../components/Balance';
import PreviousTransactions from '../components/transactions/UI/PreviousTransactions';

export default function Page() {
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
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  flex1: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 80,
    paddingHorizontal: 12,
  },
});
