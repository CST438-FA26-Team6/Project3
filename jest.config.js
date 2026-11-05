module.exports = {
  preset: 'jest-expo',

  collectCoverage: true,

  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/expo-env.d.ts',
    '!**/.expo/**',
  ],

  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};