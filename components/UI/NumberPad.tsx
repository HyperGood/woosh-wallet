import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import Input from './Input';
import Tabs, { TabOption } from './Tabs';
import { COLORS } from '../../constants/global-styles';
import i18n from '../../constants/i18n';
import { useUserBalance } from '../../hooks/useUserBalance';
import { scale } from '../../utils/scalingFunctions';
import { useAtomValue } from 'jotai';
import { totalBalanceAtom } from '../../store/store';

interface NumberPadProps {
  onChange: (amount: string) => void;
  description: string;
  setDescription: (description: string) => void;
  type?: 'request' | 'send';
  activeTab?: TabOption;
  handleTabPress?: (tab: TabOption) => void;
}

const NumberPad = ({
  onChange,
  description,
  setDescription,
  type = 'send',
  activeTab,
  handleTabPress,
}: NumberPadProps) => {
  const [amount, setAmount] = useState('0');
  const [cents, setCents] = useState('');

  const [isDecimal, setIsDecimal] = useState(false);
  const currency = '🇺🇸 USD';
  const { tokenBalances } = useUserBalance();
  const totalBalance = useAtomValue(totalBalanceAtom);

  const onNumberPress = (number: string) => {
    if (number === '.') {
      setIsDecimal(true);
      if (amount === '0' && cents === '') {
        onChange('0.');
      }
    } else if (isDecimal) {
      setCents((prevCents) => {
        const newCents = prevCents === '00' && number !== '0' ? number : prevCents + number;
        const finalAmount = amount + '.' + newCents;
        onChange(finalAmount);
        return newCents;
      });
    } else {
      setAmount((prevAmount) => {
        const newAmount = prevAmount === '0' ? number : prevAmount + number;
        let finalAmount;
        if (type === 'request') {
          finalAmount = newAmount; // allow any number if type is "request"
        } else {
          finalAmount = parseFloat(newAmount) <= tokenBalances.ausdc ? newAmount : prevAmount;
        }
        onChange(finalAmount); // call the passed callback function
        return finalAmount;
      });
    }
  };

  const onBackspacePress = () => {
    if (isDecimal) {
      setCents((prevCents) => {
        const newCents = prevCents.slice(0, -1);
        const finalAmount = amount + (newCents ? '.' + newCents : '');
        onChange(finalAmount);
        return newCents;
      });
      if (cents === '') {
        setIsDecimal(false);
      }
    } else {
      setAmount((prevAmount) => {
        const newAmount = prevAmount.slice(0, -1) || '0';
        onChange(newAmount);
        return newAmount;
      });
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'];

  const formatAmount = (amount: string) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const setAmountToMax = () => {
    const [wholePart, decimalPart] = tokenBalances.ausdc.toString().split('.');
    setAmount(wholePart);
    setCents(decimalPart || '00');
    setIsDecimal(!!decimalPart);
    onChange(tokenBalances.ausdc.toString());
  };

  return (
    <View>
      <View style={styles.amountWrapper}>
        {type === 'send' && (
          <Pressable onPress={setAmountToMax}>
            <Text style={styles.balance}>
              {i18n.t('youHave')} ${totalBalance?.toFixed(2)}
            </Text>
          </Pressable>
        )}

        <Text style={styles.amount}>
          ${formatAmount(amount)}
          {isDecimal || cents ? <Text style={styles.cents}>.{cents}</Text> : null}
        </Text>

        <View style={styles.currencyWrapper}>
          <Text style={styles.currencyText}>{currency}</Text>
        </View>
        {type !== 'send' && (
          <View style={{ marginTop: 16, marginBottom: 8 }}>
            <Tabs
              options={[
                { title: 'Total', value: 'total' },
                { title: i18n.t('perPerson'), value: 'per' },
              ]}
              activeTab={activeTab || { title: 'Total', value: 'total' }}
              onTabPress={handleTabPress || (() => {})}
            />
          </View>
        )}
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <Input
          placeholder={i18n.t('noteInputPlaceholder')}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={styles.numberPad}>
        {Array(4)
          .fill(0)
          .map((_, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {numbers.slice(rowIndex * 3, rowIndex * 3 + 3).map((number, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => pressed && styles.pressedNumber}
                  onPress={() =>
                    number === 'delete' ? onBackspacePress() : onNumberPress(number)
                  }>
                  <View style={styles.numberWrapper}>
                    {number === 'delete' ? (
                      <Feather name="chevron-left" size={32} color={COLORS.light} />
                    ) : (
                      <Text style={styles.number}>{number}</Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
      </View>
    </View>
  );
};
export default NumberPad;
const styles = StyleSheet.create({
  amountWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  amount: {
    fontSize: scale(80),
    fontFamily: 'FHOscar',
    color: COLORS.light,
  },
  cents: {
    fontSize: scale(40),
    fontFamily: 'FHOscar',
    color: COLORS.light,
  },
  currencyWrapper: {
    backgroundColor: COLORS.gray[400],
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  currencyText: {
    color: COLORS.dark,
    fontSize: scale(16),
    fontFamily: 'Satoshi-Bold',
  },
  numberPad: {
    paddingHorizontal: scale(24),
    gap: scale(40),
    marginTop: 24,
  },
  pressedNumber: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  number: {
    fontSize: scale(36),
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
  },
  numberWrapper: {
    width: scale(64),
    height: scale(64),
    justifyContent: 'center',
    alignItems: 'center',
  },
  opacity: {
    opacity: 0.6,
  },
  balance: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    opacity: 0.6,
  },
});
