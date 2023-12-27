import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';
import ClaimScreen from '../../screens/claim/ClaimScreen';
import IntroScreen from '../../screens/claim/IntroScreen';
import OnboardingScreen from '../../screens/claim/OnboardingScreen';

export default function Page() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [activeScreen, setActiveScreen] = useState('intro');

  const goToOnboarding = () => setActiveScreen('onboarding');
  const goToClaim = () => setActiveScreen('claim');

  //Use a useEffect to fetch the data from Firestore
  useEffect(() => {
    (async () => {
      const txId = Array.isArray(id) ? id[0] : id;
      const transactionData = await firestore().collection('transactions').doc(txId).get();
      if (!transactionData.exists) {
        console.log('No such document!');
        setIsLoading(false);
      } else {
        setTransactionData(transactionData.data());
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (activeScreen === 'intro') {
    return (
      <View style={styles.wrapper}>
        <IntroScreen
          sender={transactionData.sender}
          amount={transactionData.amount}
          token={transactionData.token}
          onButtonClick={goToOnboarding}
        />
      </View>
    );
  }

  if (activeScreen === 'onboarding') {
    return (
      <View style={styles.wrapper}>
        <OnboardingScreen onButtonClick={goToClaim} />
      </View>
    );
  }

  if (activeScreen === 'claim') {
    return (
      <View style={styles.wrapper}>
        <ClaimScreen backFunction={goToOnboarding} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.dark,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
