export const usdcAddress = {
  10: ['0x0b2c639c533813f4aa9d7837caf62653d097ff85'],
  11155420: ['0x697b5DbE59d565d345CB3032BC13764F61b0820b'],
  31337: ['0x5FbDB2315678afecb367f032d93F642f64180aa3'],
  8453: ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'],
  84532: ['0x415ABF2E0490b436DDfC32817ECA9010b18ccBEB'],
} as const;
//10 - optimism
//11155420 - optimism sepolia
//31337 - hardhat
//8453 - base
//84532 - base sepolia

export type TokenAddresses = typeof usdcAddress;

//usdc actually has 6 decimals, but we're using 18 for Woosh Test Token
