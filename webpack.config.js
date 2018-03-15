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
  {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'limited-use.js',
      library: 'limitedUse',
      libraryTarget: 'umd',
      libraryExport: 'default',

      // HACK: Fix webpack global object incorrectly defaulting to 'window'
      globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
  },
].map(outputConfig => merge(outputConfig, commonConfig));
