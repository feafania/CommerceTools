export default {
  preset: "ts-jest",
  testEnvironment: "jsdom", // "node" for backend
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^img/(.*)$": "<rootDir>/src/assets/img/$1",
    "^svg/(.*)$": "<rootDir>/src/assets/svg/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  coverageReporters: ["html", "text", "text-summary", "lcov"],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
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
};
