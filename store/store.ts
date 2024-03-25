import { type KernelSmartAccount, type KernelAccountClient } from '@zerodev/sdk';
import { atom } from 'jotai';
import { atomWithStorage as jotaiAtomWithStorage, createJSONStorage } from 'jotai/utils';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'atom-storage',
});

const createJotaiStorage = <T>() =>
  createJSONStorage<T>(() => ({
    getItem: (key) => {
      return storage.getString(key) ?? null;
    },
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  }));

export const defaultStorageOptions = {
  getOnInit: true,
};

export const atomWithStorage = <T>(key: string, initialValue: T) => {
  const storage = createJotaiStorage<T>();

  return jotaiAtomWithStorage<T>(key, initialValue, storage, defaultStorageOptions);
};

export const authAtom = atom<string | null>(null);
export const smartAccountAtom = atom<KernelSmartAccount | null>(null);
export const kernelClientAtom = atom<KernelAccountClient | null>(null);
export const userAddressAtom = atomWithStorage<`0x${string}` | null>('address', null);
export const totalBalanceAtom = atomWithStorage<number | 0>('total-balance', 0);
export const fiatBalanceAtom = atomWithStorage<number | 0>('fiat-balance', 0);
