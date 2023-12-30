import { StyleSheet, Text, View } from 'react-native';

import IconButton from './UI/IconButton';
import { COLORS } from '../constants/global-styles';
import { useUserBalance } from '../hooks/useUserBalance';

const Balance = () => {
  const token = 'ETH';
  const { fiatBalance, tokenBalance } = useUserBalance();

  const handleButton = () => {
    console.log('hi');
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.number}>
          ${fiatBalance?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.
          <Text style={styles.decimal}>{(fiatBalance % 1).toFixed(2).slice(2)}</Text>
        </Text>
        <View style={styles.buttonContainer}>
          <IconButton icon="plus" onPress={handleButton} />
        </View>
      </View>
      <Text style={styles.tokenBalance}>
        {tokenBalance} {token}
      </Text>
    </View>
  );
};
export default Balance;
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 48,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  number: {
    fontSize: 88,
    fontFamily: 'FHOscar',
    color: COLORS.light,
  },
  decimal: {
    fontSize: 48,
    fontFamily: 'FHOscar',
  },
  tokenBalance: {
    fontSize: 24,
    fontFamily: 'FHOscar',
    color: COLORS.light,
    opacity: 0.4,
  },
  buttonContainer: {
    paddingBottom: 16,
  },
});
