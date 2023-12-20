import 'fast-text-encoding';
import { Buffer } from 'buffer';
import { getRandomValues as expoCryptoGetRandomValues } from 'expo-crypto';

// // Polyfills for Alchemy SDK
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

class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
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
