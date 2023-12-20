import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createPublicClient, formatEther, http } from 'viem';
import { optimismGoerli } from 'viem/chains';

import IconButton from './UI/IconButton';
import { COLORS } from '../constants/global-styles';
import useAddress from '../hooks/useAddress';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { useAccount } from '../store/smart-account-context';

/*TODO:
1. Store the last balance in the user's local storage
*/
const Balance = () => {
  const { address } = useAddress();
  const { fiatBalance, tokenBalance, setFiatBalance, setTokenBalance } = useAccount();
  const token = 'ETH';
  const tokensData = useTokenPrices();
  const ethMXPrice = tokensData?.ethereum?.mxn ?? 0;
  const client = createPublicClient({
    chain: optimismGoerli,
    transport: http(`https://opt-goerli.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_ID}`),
  });

  useEffect(() => {
    if (address)
      (async () => {
        const balance = await client.getBalance({
          address,
        });
        console.log(balance);
        setTokenBalance(Number(formatEther(balance)));
        setFiatBalance(Number(formatEther(balance)) * ethMXPrice);
      })();
  }, [address]);

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
