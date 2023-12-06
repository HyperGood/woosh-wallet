import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/global-styles';

const Header = () => {
  return (
    <View>
      <Text>Header</Text>
    </View>
  );
};

const Balance = () => {
  return (
    <View>
      <Text>Balance</Text>
    </View>
  );
};

const Button = () => {
  return (
    <View>
      <Text>Button</Text>
    </View>
  );
};

const PreviousTransactions = () => {
  return (
    <View>
      <Text>Previous Transactions</Text>
    </View>
  );
};

export default function Page() {
  return (
    <View style={styles.container}>
      <Header />
      <Balance />
      <View>
        <Button />
        <Button />
      </View>
      <PreviousTransactions />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.dark,
  },
});
