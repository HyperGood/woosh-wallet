import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../../components/UI/Button';
import TransactionCardHome from '../../components/transactions/UI/TransactionCardHome';
import { COLORS } from '../../constants/global-styles';

const SuccessScreen = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00FF47', '#19181D']}
        style={styles.background}
        end={{ x: 0.3, y: 0.7 }}
      />
      <Text style={styles.title}>Sent! 🥳</Text>
      <Text style={styles.description}>A claim link has been sent to </Text>
      <TransactionCardHome amount={1000} user="User" description="For cookies" date="01/12/21" />
      <View style={styles.buttonWrapper}>
        <Button title="Share" type="primary" icon="share" onPress={() => {}} />
      </View>
    </View>
  );
};
export default SuccessScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 48,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginBottom: 4,
  },
  description: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    marginBottom: 16,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
});
