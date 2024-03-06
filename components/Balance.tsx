import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

import YieldIcon from '../assets/images/icons/YieldIcon';
import { COLORS } from '../constants/global-styles';
import { useUserBalance } from '../hooks/useUserBalance';
import { scale } from '../utils/scalingFunctions';

const DEVICE_WIDTH = Dimensions.get('window').width;

const Balance = () => {
  const token = 'USD';
  const mainCurrency = 'MXN';
  const yieldPerBlock = 0.000001;
  const { fiatBalances, tokenBalances, isFetchingBalance, refetchBalance } = useUserBalance();
  const [totalFiatBalance, setTotalFiatBalance] = useState<number>(0);
  const [totalTokenBalance, setTotalTokenBalance] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      refetchBalance();
    }, [])
  );

  useEffect(() => {
    if (fiatBalances) {
      setTotalFiatBalance(fiatBalances.ausdc + fiatBalances.usdc);
    }
    if (tokenBalances) {
      setTotalTokenBalance(tokenBalances.ausdc + tokenBalances.usdc);
    }
  }, [fiatBalances]);

  return (
    <View style={styles.wrapper}>
      <Animated.View layout={Layout} entering={FadeIn.duration(1500)} style={styles.container}>
        <Text style={styles.number}>
          ${totalFiatBalance?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.
          <Text style={styles.decimal}>{(totalFiatBalance % 1).toFixed(2).slice(2)}</Text>
        </Text>
        <Text style={styles.mainCurrency}>{mainCurrency}</Text>
      </Animated.View>

      <View style={styles.bottomWrapper}>
        <Text style={styles.tokenBalance}>
          {totalTokenBalance} {token}
        </Text>
        <View style={styles.yieldWrapper}>
          <YieldIcon />
          <Text style={styles.yieldText}>+{yieldPerBlock} USD/s</Text>
        </View>
      </View>
    </View>
  );
};
export default Balance;
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: scale(24),
    paddingHorizontal: scale(16),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  number: {
    fontSize: 80,
    fontFamily: 'FHOscar',
    color: COLORS.dark,
  },
  decimal: {
    fontSize: 48,
    fontFamily: 'FHOscar',
  },
  mainCurrency: {
    fontSize: 17,
    fontFamily: 'FHOscar',
    color: COLORS.dark,
    paddingBottom: 4,
  },
  tokenBalance: {
    fontSize: 24,
    fontFamily: 'FHOscar',
    color: COLORS.dark,
    opacity: 0.8,
  },
  bottomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 16,
    width: DEVICE_WIDTH - scale(32),
  },
  yieldWrapper: {
    backgroundColor: COLORS.dark,
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  yieldText: {
    fontSize: 20,
    fontFamily: 'FHOscar',
    color: COLORS.primary[400],
  },
});
