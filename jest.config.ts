import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  // [...]
  // Replace `ts-jest` with the preset you want to use
  // from the above list
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^pk-common$': '<rootDir>/common/index.ts$1',
  },
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
};

export default jestConfig;
