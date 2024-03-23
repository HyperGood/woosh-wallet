import { useQuery } from '@tanstack/react-query';

import { getTokenPrices } from './api';

export const useTokenPrices = () => {
  return useQuery({
    queryKey: ['tokenPrices'],
    queryFn: getTokenPrices,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });
};
