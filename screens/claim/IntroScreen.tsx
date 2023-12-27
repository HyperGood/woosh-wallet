import { Text, SafeAreaView, View, StyleSheet } from 'react-native';

import BackButton from '../../components/UI/BackButton';
import Button from '../../components/UI/Button';
import { COLORS } from '../../constants/global-styles';

interface IntroScreenProps {
  sender: string;
  amount: string;
  token: string;
  onButtonClick: () => void;
}

const IntroScreen = ({ sender, amount, token, onButtonClick }: IntroScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>{sender} sent you</Text>
      <Text style={styles.title}>
        {amount} {token}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Button title="Claim" onPress={onButtonClick} type="primary" />
      </View>
    </SafeAreaView>
  );
};
export default IntroScreen;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 48,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.02,
    lineHeight: 52,
    marginHorizontal: 32,
    marginBottom: 16,
  },
});
