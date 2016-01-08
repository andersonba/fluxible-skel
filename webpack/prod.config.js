// Webpack config for creating the production bundle.

var path = require('path');
var webpack = require('webpack');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');

var dist = path.resolve(__dirname, '../static/dist');

module.exports = {
  devtool: 'source-map',
  entry: './src/client.js',
  output: {
    path: dist,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/, loader: 'file' },
      { test: /\.js$/, loaders: [strip.loader('debug'), 'babel'], exclude: /node_modules/ },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 version!sass') }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]-[chunkhash].css'),
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    // Write out stats.json file to build directory.
    new StatsWriterPlugin({
      transform: function (data) {
        return JSON.stringify({
          main: data.assetsByChunkName.main[0],
          css: data.assetsByChunkName.main[1]
        });
      }
    })
  ]
};
