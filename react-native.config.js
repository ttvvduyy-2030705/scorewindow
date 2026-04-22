const windowsDisabledPackages = [
  '@react-native-google-signin/google-signin',
  '@realm/react',
  'realm',
  'react-native-ble-plx',
  'react-native-vision-camera',
  'react-native-webrtc',
  'react-native-worklets-core',
  'react-native-reanimated',
];

module.exports = {
  assets: ['./src/assets/fonts'],
  dependencies: Object.fromEntries(
    windowsDisabledPackages.map(name => [name, {platforms: {windows: null}}]),
  ),
};
