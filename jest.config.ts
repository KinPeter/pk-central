import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^pk-common$': '<rootDir>/common/index.ts$1',
  },
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  maxWorkers: 1,
  maxConcurrency: 1,
};

export default jestConfig;
