import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export const chain = sepolia;

const publicClient = createPublicClient({
  chain,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_ID}`),
});

export default publicClient;
