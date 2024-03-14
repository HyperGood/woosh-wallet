export const usdcAddress = {
  10: ['0x0b2c639c533813f4aa9d7837caf62653d097ff85'],
  11155420: ['0x697b5DbE59d565d345CB3032BC13764F61b0820b'],
  11155111: ['0x16dA4541aD1807f4443d92D26044C1147406EB80'],
  31337: ['0x5FbDB2315678afecb367f032d93F642f64180aa3'],
  8453: ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'],
  84532: ['0x036CbD53842c5426634e7929541eC2318f3dCF7e'],
} as const;
//10 - optimism
//11155420 - optimism sepolia
//11155111 - sepolia - aUSDc
//31337 - hardhat
//8453 - base
//84532 - base sepolia

export type TokenAddresses = typeof usdcAddress;
