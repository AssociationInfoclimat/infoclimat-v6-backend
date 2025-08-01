module.exports = {
  displayName: 'Unit Tests',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/test/',
    '<rootDir>/dist/',
    '<rootDir>/dist-api/',
    '<rootDir>/dist-cron/',
    '<rootDir>/node_modules/',
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.e2e-spec.ts',
    '!src/**/index.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.types.ts',
    '!src/**/*.constants.ts',
    '!src/testing/**/*',
  ],
  coverageDirectory: './coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/testing/jest.setup.ts',
  ],
  verbose: true,
};