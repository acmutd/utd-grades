const webpack = require("webpack");
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/** @type {import('next').NextConfig} */
module.exports = {
  basePath: process.env.BASE_PATH ?? "",
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
          "window.SQL": path.resolve(
            path.join(__dirname, "../node_modules/sql.js/dist/sql-wasm.js")
          ),
        })
      );

      // From https://github.com/samsam2310/zbar.wasm/issues/8#issuecomment-879799232
      config.module.rules.push({
        test: /\.wasm$/i,
        type: "asset/resource",
        generator: {
          filename: "static/[hash][ext][query]",
        },
      });

      config.module.rules.push({
        test: /\.sqlite3$/i,
        type: "asset/resource",
        generator: {
          // Adding the .txt extension "tricks" GitHub Pages into gzipping the db file
          filename: "static/[hash][ext][query].txt",
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
