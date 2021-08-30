const packageJson = require("./package.json")

module.exports = {
  name: packageJson.name,
  displayName: packageJson.name,
  rootDir: './',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.test.ts'],
}
