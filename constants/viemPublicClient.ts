import { createPublicClient, http } from 'viem';
import { optimismSepolia } from 'viem/chains';

const publicClient = createPublicClient({
  chain: optimismSepolia,
  transport: http(`https://opt-sepolia.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_ID}`),
});

export default publicClient;
