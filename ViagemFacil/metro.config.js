const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript path mapping
config.resolver.alias = {
  '@': './src',
  '@/domain': './src/domain',
  '@/data': './src/data',
  '@/presentation': './src/presentation',
  '@/core': './src/core',
};

module.exports = config;