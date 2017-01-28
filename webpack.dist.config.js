const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const AUTOPREFIXER_BROWSERS = ['last 2 version'];

module.exports = {
  // Entry point(s) for the bundle
  entry: {
    main: [
      'babel-polyfill',
      './src/index.jsx']
  },

  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    filename: '[name].js',
    chunkFilename: '[id].js',
    publicPath: '/assets/'
  },

  // Loaders
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'react-hot-loader/webpack!babel'
      },
      {
        test: /\.(css|styl)$/,
        loader: ExtractTextPlugin.extract('style',
                'css!'
                + `autoprefixer?{browsers:${JSON.stringify(AUTOPREFIXER_BROWSERS)}}!`
                + 'stylus')
      },
      {
        test: /\.(gif|png|jpg|svg|eot|woff2|ttf|woff)(\?|$)/,
        loader: 'url?limit=2048'
      }
    ]
  },

  // Path resolving, aliases
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      containers: path.resolve(__dirname, 'src/containers'),
      images: path.resolve(__dirname, 'src/images'),
      reducers: path.resolve(__dirname, 'src/redux/reducers'),
      styles: path.resolve(__dirname, 'src/styles'),
      utils: path.resolve(__dirname, 'src/utils')
    }
  },

  // Plugins
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: process.env.NODE_ENV === 'production'
    }),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('main.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false}
    }),
    new HtmlWebpackPlugin({
      favicon: 'src/images/favicon.ico',
      template: 'src/index.ejs',
      filename: '../index.html',
      inject: true,
      hash: true
    })
  ]
};
