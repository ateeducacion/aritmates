const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';  
  
  let arrPlugins =[
    new MiniCssExtractPlugin(),
    new HtmlWebPackPlugin({
      chunks: ['plantilla'],
      template: 'src/templates/plantillaPdf.html',
      filename: 'plantilla/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/templates', to: 'templates' },
        { from: 'src/img', to: 'img' },
        { from: 'src/config.json', to: 'config.json' },
      ],
    }),
    // new BundleAnalyzerPlugin(), // analizar paquetes visitar http://127.0.0.1:8888/ para ver desglose
  ];
  
  if (isDevelopment){
    arrPlugins.push(new HtmlWebPackPlugin({
      // inject: false,
      chunks: ['app', 'vendors'],
      template: 'src/templates/index.html',
      filename: 'index.html',
      minify: false,
    }));
  } else {
    arrPlugins.push(new HtmlWebPackPlugin({
      // inject: false,
      chunks: ['app', 'vendors'],
      template: 'src/templates/index.html',
      filename: 'index.html',
      minify: false,
    }));
  }
  const config={
    mode: 'development', // or 'production'
    entry: {
      app: './src/app.js',
      plantilla: './src/view/plantilla.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].bundle.js',
      clean: true, // Webpack 5's built-in cleaning feature
      publicPath: isDevelopment ? '/' : './'
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9012,
      hot: true,
      historyApiFallback: true,
      devMiddleware: {
        publicPath: '/',
        writeToDisk: true,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }
          ],
        },
        {
          test: /\.(sass|scss)$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
        },
        {
          test: /img\/.+\.(svg|jpg|jpeg|png|gif)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name].[ext]',
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[ext]',
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: arrPlugins,
    performance: {
      hints: false,
    },
  }; // cierra cost config =
  return config;
}; 
