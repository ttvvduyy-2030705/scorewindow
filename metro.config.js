const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const fs = require('fs');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

function normalizePathForRegex(value) {
  return value.replace(/[/\\]/g, '/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const blockList = [
  new RegExp(`${normalizePathForRegex(path.resolve(__dirname, 'windows'))}/.*`),
  /.*\.ProjectImports\.zip/,
];

try {
  const rnwPath = fs.realpathSync(
    path.resolve(require.resolve('react-native-windows/package.json'), '..'),
  );
  blockList.push(new RegExp(`${normalizePathForRegex(rnwPath)}/build/.*`));
  blockList.push(new RegExp(`${normalizePathForRegex(rnwPath)}/target/.*`));
} catch (_error) {
  // react-native-windows is installed by npm install. Keep Metro usable before install.
}

const config = {
  resolver: {
    blockList: exclusionList(blockList),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
