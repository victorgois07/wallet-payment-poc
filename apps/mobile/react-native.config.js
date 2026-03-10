const path = require('node:path');

const nativePackages = [
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-screens',
  'react-native-worklets',
  'react-native-is-edge-to-edge',
  '@react-native-community/netinfo',
];

function resolvePackageRoot(pkg) {
  try {
    const pkgJson = require.resolve(`${pkg}/package.json`, { paths: [__dirname] });
    return path.dirname(pkgJson);
  } catch {
    return path.resolve(__dirname, 'node_modules', pkg);
  }
}

const dependencies = Object.fromEntries(
  nativePackages.map((pkg) => [pkg, { root: resolvePackageRoot(pkg) }]),
);

module.exports = {
  dependencies,
};
