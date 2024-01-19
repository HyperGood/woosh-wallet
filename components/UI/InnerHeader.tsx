import { StyleSheet, Text, View } from 'react-native';

import BackButton from './BackButton';
import { COLORS } from '../../constants/global-styles';

interface HeaderProps {
  title: string;
}

const InnerHeader = ({ title }: HeaderProps) => (
  <View style={styles.header}>
    <View style={{ position: 'absolute', left: 0 }}>
      <BackButton />
    </View>
    <Text style={styles.headerTitle}>{title}</Text>
    <View />
  </View>
);

export default InnerHeader;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    position: 'relative',
  },
});
