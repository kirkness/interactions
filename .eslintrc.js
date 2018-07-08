module.exports = {
  plugins: ['prettier'],
  extends: ['airbnb', "plugin:prettier/recommended"],
  parser: 'babel-eslint',
  rules: {
    strict: 0,
    'react/jsx-filename-extension': false,
    'no-use-before-define': 0,
    'prettier/prettier': 'error',
  },
};
