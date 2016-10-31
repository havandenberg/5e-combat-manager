const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const AUTOPREFIXER_BROWSERS = ['last 2 version'];
const port = process.env.PORT || 3000;

module.exports = {
  // Entry point(s) for the bundle
  entry: {
    main: [
      `webpack-dev-server/client?http://localhost:${port}`,
      'webpack/hot/dev-server',
      './src/index.jsx'
    ]
  },

  output: {
    path: '/',
    filename: '[name].js',
    chunkFilename: '[id].js',
    publicPath: '/',
    pathinfo: true
  },

  stylint: {
    config: '.stylintrc'
  },

  // Loaders
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint?{configFile:".eslintrc.dev"}'
      },
      {
        test: /\.styl$/,
        loader: 'stylint?{config:".stylintrc"}'
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
        loader: 'style!'
                + 'css!'
                + `autoprefixer?{browsers:${JSON.stringify(AUTOPREFIXER_BROWSERS)}}!`
                + 'stylus'
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

  // Dev server configuration
  devServer: {
    hot: true,
    inline: true,
    historyApiFallback: true,
    host: 'localhost',
    port,
    contentBase: './src'
  },

  // Plugins
  plugins: [
    new OpenBrowserPlugin({url: `http://localhost:${port}`}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      favicon: 'favicon.ico',
      template: 'src/index.ejs',
      inject: true,
      hash: true
    })
  ],

  // General configuration
  debug: true,
  devtool: 'cheap-eval-source-map'
};
