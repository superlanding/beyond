module.exports = {
  ignore: [
    '**/*.test.js'
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3
      }
    ]
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }]
  ]
}
