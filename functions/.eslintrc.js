module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": "off",
    "linebreak-style": "off",
    "max-len": "off",
    "indent": "off",
    "object-curly-spacing": "off",
    "comma-dangle": "off",
    "no-trailing-spaces": "off",
    "valid-jsdoc": "off",
    "no-unused-vars": "off",
    "arrow-parens": "off",
    "padded-blocks": "off",
    "no-undef": "off"
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
