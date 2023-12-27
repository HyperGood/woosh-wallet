import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import Input from './Input';
import { COLORS } from '../../constants/global-styles';
import { useUserBalance } from '../../hooks/useUserBalance';

interface NumberPadProps {
  onChange: (amount: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const NumberPad = ({ onChange, description, setDescription }: NumberPadProps) => {
  const [amount, setAmount] = useState('0');
  const [cents, setCents] = useState('00');

  const [isDecimal, setIsDecimal] = useState(false);
  const currency = 'ETH';
  const { tokenBalance } = useUserBalance();

  const onNumberPress = (number: string) => {
    if (number === '.') {
      setIsDecimal(true);
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
        const finalAmount = parseFloat(newAmount) <= tokenBalance ? newAmount : prevAmount;
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
        onChange(finalAmount); // call the passed callback function
        return newCents || '00';
      });
      if (cents === '0') {
        setIsDecimal(false);
      }
    } else {
      setAmount((prevAmount) => {
        const newAmount = prevAmount.slice(0, -1) || '0';
        onChange(newAmount); // call the passed callback function
        return newAmount;
      });
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'];

  const formatAmount = (amount: string) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const setAmountToMax = () => {
    const [wholePart, decimalPart] = tokenBalance.toString().split('.');
    setAmount(wholePart);
    setCents(decimalPart || '00');
    setIsDecimal(!!decimalPart);
    onChange(tokenBalance.toString());
  };

  return (
    <View>
      <View style={styles.amountWrapper}>
        <Pressable onPress={setAmountToMax}>
          <Text style={styles.balance}>
            You have: {currency === 'ETH' ? 'Ξ' : '$'} {tokenBalance}
          </Text>
        </Pressable>
        <Text style={styles.amount}>
          {currency === 'ETH' ? 'Ξ' : '$'}
          {formatAmount(amount)}.
          <Text style={styles.cents}>{cents.length < 2 ? cents.padEnd(2, '0') : cents}</Text>
        </Text>

        <View style={styles.currencyWrapper}>
          <Text style={styles.currencyText}>{currency}</Text>
        </View>
      </View>
      <Input
        placeholder="Add a note or concept"
        value={description}
        onChangeText={setDescription}
      />
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
  pressedNumber: {
    opacity: 0.6,
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
  balance: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: COLORS.light,
    opacity: 0.6,
  },
});
