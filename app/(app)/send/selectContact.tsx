import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import BackButton from '../../../components/UI/BackButton';
import { COLORS } from '../../../constants/global-styles';
import SelectContactScreen from '../../../screens/send/SelectContactScreen';
import { minMaxScale } from '../../../utils/scalingFunctions';

const enterAmount = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: minMaxScale(16, 24),
        }}>
        <BackButton />
        <Text style={styles.pageTitle}>Send Funds</Text>
        <View />
      </View>
      <SelectContactScreen />
    </SafeAreaView>
  );
};

export default enterAmount;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingTop: 16,
  },
  pageTitle: {
    color: COLORS.light,
    fontSize: minMaxScale(16, 24),
    fontFamily: 'Satoshi-Bold',
  },
});
