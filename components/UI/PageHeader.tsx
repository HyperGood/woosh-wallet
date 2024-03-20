import { StyleSheet, Text, View } from 'react-native';

import BackButton from './BackButton';
import { COLORS } from '../../constants/global-styles';
import { minMaxScale } from '../../utils/scalingFunctions';

const PageHeader = ({ pageTitle }: { pageTitle?: string }) => {
  return (
    <View
      style={{
        gap: 16,
      }}>
      <BackButton />
      {pageTitle && <Text style={styles.pageTitle}>{pageTitle}</Text>}
      <View />
    </View>
  );
};
export default PageHeader;
const styles = StyleSheet.create({
  pageTitle: {
    color: COLORS.gray[400],
    fontSize: minMaxScale(16, 24),
    fontFamily: 'Satoshi-Bold',
    textTransform: 'capitalize',
  },
});
