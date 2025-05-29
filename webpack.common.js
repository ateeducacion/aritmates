const path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/app.js',
    // vendor: './src/vendor.js',
  },
  plugins: [
    new CopyPlugin([
      {from: 'src/templates', to: 'templates'},
      {from: 'src/img', to: 'img'},
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /img\/.+\.(svg|jpg|jpeg|png|gif)?$/,
        loader: 'url-loader',
        options: {
          // limit: 8192,
          name: '[name].[ext]',
          outputPath: 'img', // the icons will be stored in dist/img folder
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
        },
      },
      {
        test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
      },
    //   {
    //     test: /\.(svg|png|jpg|gif)$/,
    //     use: {
    //       loader: 'file-loader',
    //       options: {
    //         name: '[name].[hash].[ext]',
    //         outputPath: 'imgs',
    //       },
    //     },
    //   },
    ],
  },
};
