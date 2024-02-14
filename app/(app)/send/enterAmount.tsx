import { SafeAreaView, StyleSheet } from 'react-native';

import PageHeader from '../../../components/UI/PageHeader';
import { COLORS } from '../../../constants/global-styles';
import EnterAmountScreen from '../../../screens/send/EnterAmountScreen';

const enterAmount = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <PageHeader pageTitle="Send Funds" />
      <EnterAmountScreen />
    </SafeAreaView>
  );
};

export default enterAmount;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingTop: 24,
  },
});
