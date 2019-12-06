const path = require('path')
const mode = (process.env.NODE_ENV === 'production') ? 'production' : 'development'

module.exports = {
  mode,
  entry: './src/index.js',
  output: {
    filename: 'beyond.js',
    path: path.resolve(__dirname, 'dist')
  }
}
