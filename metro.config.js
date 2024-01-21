// Learn more https://docs.expo.io/guides/customizing-metro
//const { getDefaultConfig } = require('expo/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getSentryExpoConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

config.resolver.extraNodeModules = require('node-libs-react-native');

config.resolver.sourceExts.push('mjs', 'cjs');

module.exports = config;
