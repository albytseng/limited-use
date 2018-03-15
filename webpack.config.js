const _ = require('lodash');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');

const commonConfig = {
  entry: path.resolve(__dirname, 'src/index.js'),

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {root: path.resolve(__dirname)}),
  ],
};

module.exports = [
  // UMD module
  {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'limited-use.js',
      library: _.camelCase('[name]'),
      libraryTarget: 'umd',
    },
  },
].map(outputConfig => merge(outputConfig, commonConfig));
