const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resetCache: false, //캐시유지 해놓기 (로그인 유지)
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
