module.exports = {
    "roots": ["<rootDir>/src"],
    "collectCoverageFrom": ["src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts"],
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
    ],
    "testEnvironment": "jsdom",
    "transform": {
      "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": 'babel-jest',
    },
    "transformIgnorePatterns": [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$"
    ],
    "resetMocks": true
}