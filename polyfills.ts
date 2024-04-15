import 'fast-text-encoding';
import { Buffer } from 'buffer';
import { getRandomValues as expoCryptoGetRandomValues } from 'expo-crypto';
import { RSA } from 'react-native-rsa-native';

// Polyfills for Alchemy SDK
if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}

interface Algorithm {
  name: string;
  hash?: string;
  length?: number;
}

class Crypto {
  getRandomValues = expoCryptoGetRandomValues;

  subtle = {
    async generateKey(
      algorithm: Algorithm,
      extractable: boolean,
      keyUsages: string[]
    ): Promise<CryptoKey> {
      if (algorithm.name === 'AES-GCM') {
        const { length } = algorithm;
        const key = await expoCryptoGetRandomValues(new Uint8Array(length! / 8));
        return {
          type: 'secret',
          extractable,
          algorithm: { name: 'AES-GCM' },
          usages: keyUsages,
          _key: key,
        };
      } else if (algorithm.name === 'HMAC') {
        const { hash, length } = algorithm;
        const key = await expoCryptoGetRandomValues(new Uint8Array(length! / 8));
        return {
          type: 'secret',
          extractable,
          algorithm: { name: 'HMAC', hash },
          usages: keyUsages,
          _key: key,
        };
      } else {
        throw new Error('Unsupported algorithm for key generation');
      }
    },

    async exportKey(format: string, key: CryptoKey): Promise<Uint8Array> {
      if (format === 'raw') {
        return key._key;
      } else {
        throw new Error('Unsupported format for key export');
      }
    },

    async importKey(
      format: string,
      keyData: BufferSource,
      algorithm: Algorithm,
      extractable: boolean,
      keyUsages: string[]
    ): Promise<CryptoKey> {
      if (format === 'spki' && algorithm.name === 'RSA-OAEP') {
        return {
          type: 'public',
          extractable,
          algorithm: { name: 'RSA-OAEP', hash: algorithm.hash },
          usages: keyUsages,
          _key: keyData,
        };
      } else {
        throw new Error('Unsupported format or algorithm for key import');
      }
    },

    async encrypt(algorithm: Algorithm, key: string, data: string): Promise<any> {
      if (algorithm.name === 'RSA-OAEP') {
        const publicKey = key;

        const encryptedData = await RSA.encrypt(data, publicKey);

        return encryptedData;
      } else {
        throw new Error('Unsupported algorithm for encryption');
      }
    },
  };
}

// eslint-disable-next-line no-undef
const webCrypto = typeof crypto !== 'undefined' ? crypto : new Crypto();

(() => {
  if (typeof crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    });
  }
})();
