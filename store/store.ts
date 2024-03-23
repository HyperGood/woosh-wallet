import { type KernelSmartAccount, type KernelAccountClient } from '@zerodev/sdk';
import { atom } from 'jotai';

export const authAtom = atom<string | null>(null);
export const smartAccountAtom = atom<KernelSmartAccount | null>(null);
export const kernelClientAtom = atom<KernelAccountClient | null>(null);
export const userAddressAtom = atom<`0x${string}` | null>(null);
export const totalBalanceAtom = atom<number | null>(null);
