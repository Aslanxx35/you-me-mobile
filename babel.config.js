module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-reanimated/plugin MUTLAKA listenin en sonunda olmalı
      'react-native-reanimated/plugin',
    ],
  };
};
