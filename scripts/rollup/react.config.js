import {getPackageJSON, resolvePkgPath, getBaseRollupPlugins} from './utils';

const {name, module} = getPackageJSON('react');
// react包的路径
const pkgPath = resolvePkgPath(name);
// react产物路径
const pkgDistPath = resolvePkgPath(name, true);
export default [
	// react
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'React',
			format: 'umd'
		},
		plugins: getBaseRollupPlugins()
	},
	// jsx-runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime',
				format: 'umd'
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime',
				format: 'umd'
			}
		],
		plugins: getBaseRollupPlugins()
	}
];