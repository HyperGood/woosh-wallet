import { Linking } from 'react-native';
import { base, baseSepolia } from 'viem/chains';
import { normalize } from 'viem/ens';

import publicClient from '../constants/viemPublicClient';

export function openBlockExplorerURL(txHash: `0x${string}`) {
  Linking.openURL(`${baseSepolia.blockExplorers.default}/tx/${txHash}`);
}

export const fetchAddressFromENS = async (input: string) => {
  const addressFromENS = await publicClient.getEnsAddress({
    name: normalize(input),
  });
  return addressFromENS ? [{ id: addressFromENS, ethAddress: addressFromENS, name: input }] : [];
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-5)}`;
};
