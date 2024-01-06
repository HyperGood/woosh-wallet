import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';
import ClaimScreen from '../../screens/claim/ClaimScreen';
import IntroScreen from '../../screens/claim/IntroScreen';
import OnboardingScreen from '../../screens/claim/OnboardingScreen';
import WelcomeScreen from '../../screens/claim/WelcomeScreen';

export default function Page() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [activeScreen, setActiveScreen] = useState('welcome');

  const goToWelcome = () => setActiveScreen('welcome');
  const goToIntro = () => setActiveScreen('intro');
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

  if (activeScreen === 'welcome') {
    return (
      <View style={styles.wrapper}>
        <WelcomeScreen
          loadingTransactionData={isLoading}
          transactionData={transactionData}
          nextScreenFunction={goToIntro}
        />
      </View>
    );
  }

  if (activeScreen === 'intro') {
    return (
      <View style={styles.wrapper}>
        <IntroScreen
          backFuncion={goToWelcome}
          transactionData={transactionData}
          nextScreenFunction={goToOnboarding}
        />
      </View>
    );
  }

  if (activeScreen === 'onboarding') {
    return (
      <View style={styles.wrapper}>
        <OnboardingScreen nextScreenFunction={goToClaim} dbName={transactionData.recipientName} />
      </View>
    );
  }

  if (activeScreen === 'claim') {
    return (
      <View style={styles.wrapper}>
        <ClaimScreen
          backFunction={goToOnboarding}
          transactionData={transactionData}
          id={Array.isArray(id) ? id[0] : id}
        />
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
