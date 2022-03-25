const webpack = require("webpack");
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  webpack: (config, { isServer }) => {

    if (!isServer) {
      config.plugins.push(
        new NodePolyfillPlugin(),
        new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
          result.request = result.request.replace(/typeorm/, "typeorm/browser");
        }),
        new webpack.ProvidePlugin({
          'window.SQL': path.resolve(path.join(__dirname, '/node_modules/sql.js/dist/sql-wasm.js'))
        })
      );

      // From https://github.com/samsam2310/zbar.wasm/issues/8#issuecomment-879799232
      config.module.rules.push({
        test: /\.wasm$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]'
        }
      });

      config.module.rules.push({
        test: /\.sqlite3$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]'
        }
      });

      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback = {
        fs: false
      };
    }

    return config;
  },
};
