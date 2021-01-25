const path = require('path')
const mode = (process.env.NODE_ENV === 'production') ? 'production' : 'development'

module.exports = {
  mode,
  devtool: 'source-map',
  entry: './src/js/jquery/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve('src/js/jquery'),
        ],
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
  output: {
    library: 'beyond-jquery',
    libraryTarget: 'umd',
    filename: 'beyond-jquery.js',
    path: path.resolve(__dirname, '../dist')
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
}
