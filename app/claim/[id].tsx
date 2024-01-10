import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';
import OnboardingScreen from '../../screens/claim/OnboardingScreen';
import PhoneScreen from '../../screens/claim/PhoneScreen';
import WelcomeScreen from '../../screens/claim/WelcomeScreen';

export default function Page() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [activeScreen, setActiveScreen] = useState('welcome');

  const goToWelcome = () => setActiveScreen('welcome');
  const goToIntro = () => setActiveScreen('intro');
  const goToOnboarding = () => setActiveScreen('onboarding');

  //Use a useEffect to fetch the data from Firestore
  useEffect(() => {
    (async () => {
      const txId = Array.isArray(id) ? id[0] : id;
      const transactionData = await firestore().collection('transactions').doc(txId).get();
      if (!transactionData.exists) {
        console.log('No such document!');
        setIsLoading(false);
      } else {
        //wait for 2 seconds to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 2000));
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
        <PhoneScreen
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
        <OnboardingScreen transactionData={transactionData} id={Array.isArray(id) ? id[0] : id} />
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
