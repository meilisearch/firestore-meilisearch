module.exports = {
  root: true,
  env: {
    'jest/globals': true,
    'jest': true,
    'browser': true,
    'commonjs': true,
    // 'es2021': true,
    'es6': true,
    'node': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'google',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import', 'prettier', 'jest'],
  rules: {
    'no-unused-vars': ['error', { varsIgnorePattern: '^omit.*$' }],
    'array-callback-return': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'prettier/prettier': [
      'error',
      {
        quoteProps: 'consistent',
        semi: false,
        arrowParens: 'avoid',
        singleQuote: true,
      },
    ],
  },
}
