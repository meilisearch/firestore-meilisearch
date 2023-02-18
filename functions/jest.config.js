process.env.FIREBASE_CONFIG = '{}'

module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/__tests__/tsconfig.json',
      },
    ],
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.test.ts'],
  setupFiles: ['<rootDir>/__tests__/jest.setup.ts'],
}
