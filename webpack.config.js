const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  // Use Expo's default Webpack config for Web so that Babel presets/plugins
  // match Expo SDK (babel-preset-expo, reanimated plugin, aliases, etc.).
  const config = await createExpoWebpackConfigAsync(env, argv);

  // You can customize the config here if needed, but avoid overriding Babel
  // so that expo export:web works reliably.
  return config;
};
