import { Linking } from 'react-native';
import { base, baseSepolia } from 'viem/chains';

export function openBlockExplorerURL(txHash: `0x${string}`) {
  Linking.openURL(`${baseSepolia.blockExplorers.default}/tx/${txHash}`);
}
