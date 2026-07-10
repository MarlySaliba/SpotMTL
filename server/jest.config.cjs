module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: "test/.*\\.(spec|e2e-spec)\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
