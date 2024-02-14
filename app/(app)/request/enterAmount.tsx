import { SafeAreaView, StyleSheet } from 'react-native';

import PageHeader from '../../../components/UI/PageHeader';
import { COLORS } from '../../../constants/global-styles';
import i18n from '../../../constants/i18n';
import RequestEnterAmountScreen from '../../../screens/request/EnterAmountScreen';

const enterAmount = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <PageHeader pageTitle={i18n.t('requestHeaderTitle')} />
      <RequestEnterAmountScreen />
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
