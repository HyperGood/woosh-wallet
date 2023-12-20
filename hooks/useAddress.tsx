import { useEffect, useState } from 'react';

import { useAccount } from '../store/smart-account-context';

const useAddress = () => {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const { ecdsaProvider } = useAccount();

  useEffect(() => {
    (async () => {
      if (!ecdsaProvider) return;
      const address = await ecdsaProvider.getAddress();
      setAddress(address);
    })();
  }, [ecdsaProvider]);

  return { address };
};

export default useAddress;
