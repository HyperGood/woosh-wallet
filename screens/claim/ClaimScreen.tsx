import { Text, SafeAreaView, StyleSheet, Pressable } from 'react-native';

import { COLORS } from '../../constants/global-styles';

interface ClaimScreenProps {
  backFunction: () => void;
}

const ClaimScreen = ({ backFunction }: ClaimScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={backFunction}>
        <Text>Go home</Text>
      </Pressable>
      <Text style={styles.title}>Claim Screen</Text>
    </SafeAreaView>
  );
};
export default ClaimScreen;
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
