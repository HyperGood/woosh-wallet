import { SafeAreaView, StyleSheet } from 'react-native';

import PageHeader from '../../../components/UI/PageHeader';
import { COLORS } from '../../../constants/global-styles';
import i18n from '../../../constants/i18n';
import SelectContactScreen from '../../../screens/request/SelectContactScreen';

const selectContact = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <PageHeader pageTitle={i18n.t('requestHeaderTitle')} />
      <SelectContactScreen />
    </SafeAreaView>
  );
};

export default selectContact;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.dark,
    paddingTop: 24,
  },
});
