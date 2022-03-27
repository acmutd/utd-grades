const webpack = require('webpack');
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    // next will complain "warn  - Production code optimization has been disabled in your project. Read more: https://nextjs.org/docs/messages/minification-disabled"
    // but don't worry about it... this build is actually somehow _smaller_ than the "optimized" one...
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // TypeORM relies on class names for generating queries, so these need to remain unmangled
            // FIXME: I honestly it's a typeorm bug that this is needed since we specify `name` in `@Entity`
            keep_classnames: /(CatalogNumber)|(Professor)|(Section)|(Semester)|(Subject)|(Grades)/,
          }
        })
      ]
    }

    if (!isServer) {
      config.plugins.push(
        new NodePolyfillPlugin(),
        new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (
          result
        ) {
          result.request = result.request.replace(/typeorm/, 'typeorm/browser');
        }),
        new webpack.ProvidePlugin({
          'window.SQL': path.resolve(
            path.join(__dirname, '/node_modules/sql.js/dist/sql-wasm.js')
          ),
        })
      );

      // From https://github.com/samsam2310/zbar.wasm/issues/8#issuecomment-879799232
      config.module.rules.push({
        test: /\.wasm$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]',
        },
      });

      config.module.rules.push({
        test: /\.sqlite3$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]',
        },
      });

      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};
