import { StyleSheet, Text, View } from 'react-native';

import Button from '../components/UI/Button';
import { COLORS } from '../constants/global-styles';

const SignInScreen = () => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>La manera mas facil de pagarle a tus amigos</Text>
      <View style={styles.buttonContainer}>
        <Button title="Iniciar sesion" onPress={() => {}} />
      </View>
    </View>
  );
};
export default SignInScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
    justifyContent: 'center',
    padding: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: 24,
  },
});
