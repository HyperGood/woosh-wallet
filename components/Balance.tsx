import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

import YieldIcon from '../assets/images/icons/YieldIcon';
import { COLORS } from '../constants/global-styles';
import { useAaveData } from '../hooks/AAVE/useAaveData';
import { fiatBalanceAtom, totalBalanceAtom } from '../store/store';
import { scale } from '../utils/scalingFunctions';

const DEVICE_WIDTH = Dimensions.get('window').width;

const Balance = () => {
  const token = 'USD';
  const mainCurrency = 'MXN';
  const totalBalance = useAtomValue(totalBalanceAtom);
  const fiatBalance = useAtomValue(fiatBalanceAtom);

  const usdcApy = useAaveData();

  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
  const periods = ['minute', 'day', 'week', 'month', 'year'] as const;
  const [yieldForPeriod, setYieldForPeriod] = useState<number>(0);

  const calculateYieldForPeriod = (
    principal: number,
    apy: number,
    period: 'minute' | 'day' | 'week' | 'month' | 'year'
  ): number => {
    const apyDecimal = apy / 100;
    const annualInterest = principal * apyDecimal;
    const interest = annualInterest / (365 * 24 * 60);
    const minutesInPeriod = {
      minute: 1,
      day: 1440,
      week: 10080,
      month: 43200,
      year: 525600,
    };

    return interest * minutesInPeriod[period];
  };

  useEffect(() => {
    if (totalBalance) {
      const currentPeriod = periods[currentPeriodIndex];
      setYieldForPeriod(calculateYieldForPeriod(totalBalance || 0, usdcApy, currentPeriod));
    }
  }, [totalBalance, usdcApy]);

  const handlePress = () => {
    setCurrentPeriodIndex((currentPeriodIndex + 1) % periods.length);
  };

  useEffect(() => {
    const currentPeriod = periods[currentPeriodIndex];
    setYieldForPeriod(calculateYieldForPeriod(totalBalance || 0, usdcApy, currentPeriod));
  }, [currentPeriodIndex]);

  return (
    <View style={styles.wrapper}>
      <Animated.View layout={Layout} entering={FadeIn.duration(1500)} style={styles.container}>
        <Text style={styles.number}>
          ${fiatBalance?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.
          <Text style={styles.decimal}>{(fiatBalance % 1).toFixed(2).slice(2)}</Text>
        </Text>
        <Text style={styles.mainCurrency}>{mainCurrency}</Text>
      </Animated.View>

      <View style={styles.bottomWrapper}>
        <Text style={styles.tokenBalance}>
          {totalBalance?.toLocaleString('en', {
            maximumFractionDigits: 8,
            minimumFractionDigits: 2,
          }) || 0}{' '}
          {token}
        </Text>
        <Pressable style={styles.yieldWrapper} onPress={handlePress}>
          <YieldIcon />
          <Text style={styles.yieldText}>
            +$
            {yieldForPeriod > 0.0099
              ? yieldForPeriod.toLocaleString('en', {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 2,
                })
              : yieldForPeriod.toLocaleString('en', {
                  maximumFractionDigits: 7,
                  minimumFractionDigits: 2,
                })}{' '}
            USD/{periods[currentPeriodIndex]}
          </Text>
        </Pressable>
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
    fontSize: 72,
    fontFamily: 'FHOscar',
    color: COLORS.dark,
  },
  decimal: {
    fontSize: 36,
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
    alignItems: 'flex-start',
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
