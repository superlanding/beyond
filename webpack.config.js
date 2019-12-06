const path = require('path')
const mode = (process.env.NODE_ENV === 'production') ? 'production' : 'development'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode,
  entry: './src/js/index.js',
  module: {
    rules: [
      {
       test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: (process.env.NODE_ENV === 'development')
            }
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  output: {
    filename: 'beyond.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'beyond.css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    })
  ]
}
