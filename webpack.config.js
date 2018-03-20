/*
    ./webpack.config.js
*/

const path = require('path');
const webpack = require('webpack');

/* ~~~~~ plugins ~~~~~~ */
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  /* set our skeleton HTML as the template */
  template: './client/index.html',
  /* filename refers to the name of the HTML that the plugin will generate */
  filename: 'index.html',
  /* add any JavaScript into the bottom of the page, just before the closing body tag. */
  inject: 'body',
});

const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin()
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
  /* bundler starts the bundling process */
  entry: [
    './client/index.js',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
  ],
  /* where the bundled Javascript code is to be saved. */
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js',
    publicPath: '/',
  },
  module: {
    /* loaders: transformations that are applied on a file */
    loaders: [ /* list of loaders: https://webpack.github.io/docs/list-of-loaders.html */
      /* babel-loader goes through and transpiles every file that ends with a ".js" or ".jsx" */
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options:
            {
              limit: 5000,
              name: 'client/assets/images/[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options:
            {
              name: 'client/assets/images[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options:
            {
              name: 'assets/fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    HtmlWebpackPluginConfig,
    HotModuleReplacementPlugin,
  ],
};
