const {defaults} = require('jest-config');

module.exports = {
	...defaults,
	rootDir: process.cwd(),
	modulePathIgnorePatterns: ['<rootDir>/.history', '<rootDir>/apps'],
	moduleDirectories: [
		// 对于第三方依赖
		...defaults.moduleDirectories,
		// 对于 React ReactDom
		'dist/node_modules'
	],
	testEnvironment: 'jsdom'
	// moduleNameMapper: {
	// 	'^scheduler$': '<rootDir>/node_modules/scheduler/unstable_mock.js'
	// },
	// fakeTimers: {
	// 	enableGlobally: true,
	// 	legacyFakeTimers: true
	// },
	// setupFilesAfterEnv: ['./scripts/jest/setupJest.js']
};
