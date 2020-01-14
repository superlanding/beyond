const path = require('path')
const mode = (process.env.NODE_ENV === 'production') ? 'production' : 'development'

module.exports = {
  mode,
  devtool: 'source-map',
  entry: './assets/js/default.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  output: {
    filename: 'web.js',
    path: path.resolve(__dirname, '../dist')
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:4000"
    }
  }
}
