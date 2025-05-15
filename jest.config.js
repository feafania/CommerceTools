export default {
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: process.env.CI
    ? ["lcov", "text-summary"]
    : ["html", "text-summary"],
  coverageThreshold: {
    global: {
      statements: 25,
      branches: 25,
      functions: 25,
      lines: 25,
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/**/*.stories.ts",
    "!src/**/__mocks__/**",
    "!src/**/__tests__/**",
  ],
  projects: [
    {
      displayName: "browser",
      preset: "ts-jest",
      testEnvironment: "jsdom",
      testMatch: ["**/__tests__/unit/browser/**/*.[jt]s?(x)"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^img/(.*)$": "<rootDir>/src/assets/img/$1",
        "^svg/(.*)$": "<rootDir>/src/assets/svg/$1",
      },
    },
    {
      displayName: "node",
      preset: "ts-jest",
      testEnvironmentOptions: {
        NODE_OPTIONS: "--no-deprecation",
      },
      testMatch: ["**/__tests__/unit/node/**/*.[jt]s?(x)"],
      setupFiles: ["<rootDir>/jest.setup.ts"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^img/(.*)$": "<rootDir>/src/assets/img/$1",
        "^svg/(.*)$": "<rootDir>/src/assets/svg/$1",
      },
    },
    {
      displayName: "integration",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["**/__tests__/integration/**/*.[jt]s?(x)"],
      setupFiles: ["<rootDir>/jest.setup.ts"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^img/(.*)$": "<rootDir>/src/assets/img/$1",
        "^svg/(.*)$": "<rootDir>/src/assets/svg/$1",
      },
    },
  ],
};
