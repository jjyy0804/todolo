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
<<<<<<< HEAD
    'prettier/prettier': 'warn',
    'no-undef': 'warn', // This will trigger a warning instead of an error
    'no-unused-vars': 'warn', // Will now trigger a warning instead of an error
=======
    'prettier/prettier': 'error',
<<<<<<< HEAD
>>>>>>> 1fb0d03db95e03c8369cbae5321f07ddfc314b94
=======
    'no-undef': 'warn',
    'no-unused-vars': 'warn',
>>>>>>> 18686e2848a63a03f31efe0519cf8d249ce76d3b
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
