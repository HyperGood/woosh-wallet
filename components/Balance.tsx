import { Skeleton } from 'moti/skeleton';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

import IconButton from './UI/IconButton';
import { COLORS } from '../constants/global-styles';
import { useUserBalance } from '../hooks/useUserBalance';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const Balance = () => {
  const token = 'USD';
  const { fiatBalance, tokenBalance, isFetchingBalance, refetchBalance } = useUserBalance();

  useFocusEffect(
    useCallback(() => {
      refetchBalance();
    }, [])
  );

  const handleButton = () => {
    console.log('hi');
  };
  return (
    <View style={styles.wrapper}>
      <Skeleton show={isFetchingBalance} height={110} width={300}>
        <Animated.View layout={Layout} entering={FadeIn.duration(1500)} style={styles.container}>
          <Text style={styles.number}>
            ${fiatBalance?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.
            <Text style={styles.decimal}>{(fiatBalance % 1).toFixed(2).slice(2)}</Text>
          </Text>
          <View style={styles.buttonContainer}>
            <IconButton icon="plus" onPress={handleButton} />
          </View>
        </Animated.View>
      </Skeleton>
      <Skeleton show={isFetchingBalance} height={30} width={200}>
        <Text style={styles.tokenBalance}>
          {tokenBalance} {token}
        </Text>
      </Skeleton>
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
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  buttonContainer: {
    paddingBottom: 16,
  },
});
