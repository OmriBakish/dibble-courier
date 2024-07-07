const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {getDefaultConfig: getDefaultConfigRN} = require('metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {transformer, resolver} = defaultConfig;

module.exports = mergeConfig(defaultConfig, {
  transformer: {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  },
});
