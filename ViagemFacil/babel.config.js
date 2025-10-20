module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/domain': './src/domain',
            '@/data': './src/data',
            '@/presentation': './src/presentation',
            '@/core': './src/core',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};