import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

export const chain = baseSepolia;

const publicClient = createPublicClient({
  chain,
  transport: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_ID}`),
});

export default publicClient;
