const path = require('path')
const mode = (process.env.NODE_ENV === 'production') ? 'production' : 'development'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode,
  devtool: 'source-map',
  entry: './src/js/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve('src/js'),
          path.resolve('node_modules/@superlanding')
        ],
        options: {
          configFile: path.resolve('.babelrc')
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader'
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            }
          }
        ],
        exclude: /src\/sass\/img/
      },
      {
        test: /\.css$/,
        use: ['postcss-loader']
      },
      {
       test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: (process.env.NODE_ENV === 'development')
            }
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  output: {
    library: 'beyond',
    libraryTarget: 'umd',
    filename: 'beyond.js',
    path: path.resolve(__dirname, '../dist')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'beyond.css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    })
  ],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:4000"
    }
  }
}
