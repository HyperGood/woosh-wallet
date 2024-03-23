import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const getTokenPrices = async () => {
  return (await axiosInstance.get('simple/price?ids=ethereum%2Cusd-coin&vs_currencies=mxn%2Cusd'))
    .data;
};
