import { SafeAreaView, StyleSheet } from 'react-native';

import PageHeader from '../../../../components/UI/PageHeader';
import { COLORS } from '../../../../constants/global-styles';
import SelectContactScreen from '../../../../screens/send/SelectContactScreen';

const enterAmount = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <PageHeader pageTitle="Send Funds" />
      <SelectContactScreen />
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
