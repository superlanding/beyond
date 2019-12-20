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
    "max-len": ["error", { "code": 90, "comments": 90 }],
    "arrow-parens": "off",
    "brace-style": ["error", "stroustrup"],
    "comma-dangle": "off",
    "object-curly-spacing": ["error", "always"],
    "space-before-function-paren": "off"
  }
}
