module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.test.ts'],
  setupFiles: ['<rootDir>/__tests__/jest.setup.ts'],
}
