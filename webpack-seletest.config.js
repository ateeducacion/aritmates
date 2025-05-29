const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

const config = {
  mode: 'development',
  entry: './sele-tests.js',
  output: {
    filename: './testSeleniumBundle.js',
  },
  target: 'node',
  externals: [nodeExternals()],
  node: {
    fs: 'empty',
  },
};

module.exports = config;
