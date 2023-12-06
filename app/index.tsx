import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '../constants/global-styles';
import Button from '../components/UI/Button';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/images/profile.png')} style={styles.profilePicture} />
      <View style={styles.usertag}>
        <Text style={styles.userText}>$roy</Text>
      </View>
      <Feather name="maximize" size={32} color="white" />
    </View>
  );
};

const Balance = () => {
  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.balanceText}>
        $0.<Text style={styles.balanceCents}>00</Text>
      </Text>
      <View style={styles.depositButton}>
        <Feather name="plus" size={14} color="black" />
      </View>
    </View>
  );
};

const PreviousTransactions = () => {
  return (
    <View>
      <Text style={styles.textWhite}>Previous Transactions</Text>
    </View>
  );
};

export default function Page() {
  function buttonPress() {
    console.log('Button Pressed!');
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.dark }}>
      <View style={styles.container}>
        <Header />
        <Balance />
        <View style={styles.buttonsContainer}>
          <View style={{ width: '48%' }}>
            <Button title="Cobrar" onPress={buttonPress} icon="arrow-down-left" />
          </View>
          <View style={{ width: '48%' }}>
            <Button title="Enviar" onPress={buttonPress} type="primary" icon="send" />
          </View>
        </View>
        <PreviousTransactions />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  //header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  usertag: {
    backgroundColor: COLORS.primary[400],
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  userText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    letterSpacing: -0.02,
  },
  //balance styles
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  balanceText: {
    fontFamily: 'FHOscar',
    fontSize: 80,
    color: 'white',
    letterSpacing: -0.02,
  },
  balanceCents: {
    fontSize: 40,
  },
  depositButton: {
    backgroundColor: COLORS.light,
    borderRadius: 100,
    padding: 4,
    marginLeft: 16,
    marginBottom: 16,
  },
  //Home
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    gap: 16,
  },
  //Previous Transactions
  textWhite: {
    color: COLORS.light,
  },
});
