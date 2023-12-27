import { Text, SafeAreaView, StyleSheet } from 'react-native';

import Button from '../../components/UI/Button';
import { COLORS } from '../../constants/global-styles';

interface OnboardingScreenProps {
  onButtonClick: () => void;
}

const OnboardingScreen = ({ onButtonClick }: OnboardingScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <Button title="Next" onPress={onButtonClick} type="primary" />
    </SafeAreaView>
  );
};
export default OnboardingScreen;
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
