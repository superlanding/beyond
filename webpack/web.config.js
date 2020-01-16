const path = require('path')
const mode = (process.env.NODE_ENV === 'production') ? 'production' : 'development'

const output = {
  filename: 'web.js',
  path: path.resolve(__dirname, '../dist')
}

if (mode === 'development') {
  output.publicPath = 'http://localhost:8080/'
}
else {
  output.publicPath = '/beyond/dist/'
}

module.exports = {
  mode,
  devtool: 'source-map',
  entry: './assets/js/default.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve('.babelrc')
            }
          },
          'eslint-loader'
        ]
      }
    ]
  },
  output,
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:4000"
    }
  }
}
