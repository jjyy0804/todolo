module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'prettier/prettier': 'warn',
    'no-undef': 'warn', // This will trigger a warning instead of an error
    'no-unused-vars': 'warn', // Will now trigger a warning instead of an error
    'react-hooks/rules-of-hooks': 'warn'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
