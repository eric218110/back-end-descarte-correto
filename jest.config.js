const tsConfig = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*-protocols.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/protocols/**',
  ],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/src/' }),
};
