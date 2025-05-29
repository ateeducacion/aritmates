const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

const config = {
  mode: 'development',
  entry: './all-tests.js',
  // devtool: 'eval', // fastest , source: generated-code
  // devtool: 'cheap-eval-source-map', // faster ; production NO; original source (lines-only)
  // devtool: 'eval-source-map', // fast ; production No; original-source
  // devtool: none,
  output: {
    filename: 'testBundle.js',
  },
  target: 'node',
  externals: [nodeExternals()],
  // node: {
  //   fs: 'empty',
  // },
  plugins: [
    // new WebpackShellPlugin({
    //   onBuildExit: 'mocha -w ./dist/testBundle.js',
    // }),
  ],
};

module.exports = config;
