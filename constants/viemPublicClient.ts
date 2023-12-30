import { createPublicClient, http } from 'viem';
import { optimismGoerli } from 'viem/chains';

const publicClient = createPublicClient({
  chain: optimismGoerli,
  transport: http(`https://opt-goerli.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_ID}`),
});

export default publicClient;
