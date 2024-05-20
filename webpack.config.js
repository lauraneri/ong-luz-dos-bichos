const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const getSrcPath = (filePath) => {
  const src = path.resolve(__dirname, 'src');
  return path.posix.join(src.replace(/\\/g, '/'), filePath);
};

module.exports = {
  mode: 'none',
  context: __dirname,
  entry: getSrcPath('/entry.js'),
  output: {
    filename: `code.js`,
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js'],
  },
  externals: [nodeExternals()],
  performance: {
    hints: false,
  },
  watchOptions: {
    ignored: ['**/node_modules', '**/dist'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: getSrcPath('../appsscript.json'),
          to: '[name][ext]',
        },
        {
          from: getSrcPath('../src/template/adventureTime.js'),
          to: '[name][ext]',
        },
        {
          from: getSrcPath('../page'),
          to: '[name][ext]',
        },
        {
          from: getSrcPath('../src/triggers/onOpen.js'),
          to: '[name][ext]',
        },
      ],
    }),
    new GasPlugin(),
  ],
};
