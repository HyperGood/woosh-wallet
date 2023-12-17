import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../components/UI/Button';
import { COLORS } from '../constants/global-styles';
import { useSession } from '../store/auth-context';

export default function Page() {
  const { authenticate } = useSession();
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>La manera mas facil de pagarle a tus amigos</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar sesion"
          onPress={() => {
            authenticate('1');
            router.replace('/');
          }}
        />
      </View>
    </View>
  );
}

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
