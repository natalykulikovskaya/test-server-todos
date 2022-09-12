module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  preset: '@shelf/jest-mongodb',
  testMatch: ["<rootDir>/src/**.test.js"],
  displayName: "unittest",
};