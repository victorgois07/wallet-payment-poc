const path = require('node:path');

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const REACT_ROOT = path.resolve(monorepoRoot, 'node_modules', 'react');
const MOBILE_NODE_MODULES = path.resolve(projectRoot, 'node_modules');
const PACKAGE_ROOT_BY_NAME = {
  react: REACT_ROOT,
  'react-native': path.resolve(MOBILE_NODE_MODULES, 'react-native'),
  'react-native-safe-area-context': path.resolve(
    MOBILE_NODE_MODULES,
    'react-native-safe-area-context',
  ),
  'react-native-gesture-handler': path.resolve(MOBILE_NODE_MODULES, 'react-native-gesture-handler'),
  'react-native-reanimated': path.resolve(MOBILE_NODE_MODULES, 'react-native-reanimated'),
  'react-native-screens': path.resolve(MOBILE_NODE_MODULES, 'react-native-screens'),
  'react-native-worklets': path.resolve(MOBILE_NODE_MODULES, 'react-native-worklets'),
};

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    extraNodeModules: PACKAGE_ROOT_BY_NAME,
    unstable_enableSymlinks: true,
    resolveRequest: (context, moduleName, platform) => {
      for (const [packageName, packageRoot] of Object.entries(PACKAGE_ROOT_BY_NAME)) {
        if (moduleName === packageName) {
          const forcedOriginPath = packageName === 'react' ? monorepoRoot : MOBILE_NODE_MODULES;
          return context.resolveRequest(
            { ...context, originModulePath: forcedOriginPath },
            packageName,
            platform,
          );
        }

        if (moduleName.startsWith(`${packageName}/`)) {
          const subpath = moduleName.slice(packageName.length + 1);
          const absoluteModulePath = path.resolve(packageRoot, subpath);
          return context.resolveRequest(context, absoluteModulePath, platform);
        }
      }

      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = withNativeWind(mergeConfig(getDefaultConfig(__dirname), config), {
  input: './global.css',
});
