const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let conf = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
  },
  devServer: {
    port: 9000,
    hot: true,
    static: {
      directory: path.join(__dirname, './dist'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Virtual Keyboard',
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

module.exports = conf;