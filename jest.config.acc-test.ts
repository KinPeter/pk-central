import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test-acc/**/*.spec.ts'],
  maxWorkers: 1,
  maxConcurrency: 1,
};

export default jestConfig;
