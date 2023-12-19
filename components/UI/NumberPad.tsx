import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import Input from './Input';
import { COLORS } from '../../constants/global-styles';

const NumberPad = () => {
  const [amount, setAmount] = useState('0');
  const [cents, setCents] = useState('00');
  const [isDecimal, setIsDecimal] = useState(false);

  const onNumberPress = (number: string) => {
    if (number === '.') {
      setIsDecimal(true);
    } else if (isDecimal) {
      setCents((prevCents) => {
        const newCents = prevCents === '00' ? number : prevCents + number;
        return newCents.length <= 6 ? newCents : prevCents;
      });
    } else {
      setAmount((prevAmount) => {
        const newAmount = prevAmount === '0' ? number : prevAmount + number;
        return parseFloat(newAmount) <= 99999.99 ? newAmount : prevAmount;
      });
    }
  };

  const onBackspacePress = () => {
    if (isDecimal) {
      setCents((prevCents) => {
        if (prevCents.length > 1) {
          return prevCents.slice(0, -1);
        } else {
          setIsDecimal(false);
          return '00';
        }
      });
      if (cents === '0') {
        setIsDecimal(false);
      }
    } else {
      setAmount((prevAmount) => prevAmount.slice(0, -1) || '0');
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'];

  const formatAmount = (amount: string) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <View>
      <View style={styles.amountWrapper}>
        <Text style={styles.amount}>
          ${formatAmount(amount)}.
          <Text style={styles.cents}>{cents.length < 2 ? cents.padEnd(2, '0') : cents}</Text>
        </Text>

        <View style={styles.currencyWrapper}>
          <Text style={styles.currencyText}>MXN</Text>
        </View>
      </View>
      <Input placeholder="Add a note or concept" value="" onChangeText={() => {}} />
      <View style={styles.numberPad}>
        {Array(4)
          .fill(0)
          .map((_, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {numbers.slice(rowIndex * 3, rowIndex * 3 + 3).map((number, index) => (
                <Pressable
                  key={index}
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
    fontSize: 80,
    fontFamily: 'FHOscar',
    color: COLORS.light,
  },
  cents: {
    fontSize: 40,
    fontFamily: 'FHOscar',
    color: COLORS.light,
  },
  currencyWrapper: {
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  currencyText: {
    color: COLORS.dark,
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    opacity: 0.6,
  },
  numberPad: {
    paddingHorizontal: 24,
    gap: 40,
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  number: {
    fontSize: 36,
    color: COLORS.light,
    fontFamily: 'Satoshi-Bold',
  },
  numberWrapper: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opacity: {
    opacity: 0.6,
  },
});
