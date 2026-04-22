import type { Config } from "jest";

const config: Config = {
  preset:              "ts-jest",
  testEnvironment:     "node",
  rootDir:             ".",
  testMatch:           ["**/tests/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory:   "coverage",
  coverageReporters:   ["text", "lcov"],
  setupFilesAfterEnv:  ["./tests/setup.ts"],
};

export default config;