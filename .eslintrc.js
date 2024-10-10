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
    'react/jsx-closing-bracket-location': [1, 'tag-aligned'],
    'prettier/prettier': ['error', { jsxBracketSameLine: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
