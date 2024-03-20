import { Linking } from 'react-native';
import { base, baseSepolia } from 'viem/chains';
import publicClient from '../constants/viemPublicClient';
import { normalize } from 'viem/ens';

export function openBlockExplorerURL(txHash: `0x${string}`) {
  Linking.openURL(`${baseSepolia.blockExplorers.default}/tx/${txHash}`);
}

export const fetchAddressFromENS = async (input: string) => {
  const addressFromENS = await publicClient.getEnsAddress({
    name: normalize(input),
  });
  return addressFromENS ? [{ id: addressFromENS, ethAddress: addressFromENS, name: input }] : [];
};
