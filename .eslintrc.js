module.exports = {
  env: {
    es6: true,
    browser: true
  },
  extends: 'google',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    "require-jsdoc": "off",
    "padded-blocks": "off",
    "semi": "off",
    "max-len": ["error", { "code": 110, "comments": 110 }],
    "arrow-parens": "off",
    "brace-style": ["error", "stroustrup"],
    "comma-dangle": "off",
    "object-curly-spacing": ["error", "always"],
    "space-before-function-paren": "off",
    "no-unused-vars": "warn",
    "indent": ["warn", 2, { "SwitchCase": 1 }]
  }
}
