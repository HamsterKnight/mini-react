import {getPackageJSON, resolvePkgPath, getBaseRollupPlugins} from './utils';

import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';

const {name, module} = getPackageJSON('react-dom');
// react包的路径
const pkgPath = resolvePkgPath(name);
// react产物路径
const pkgDistPath = resolvePkgPath(name, true);
export default [
	// react
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: 'index.js',
				format: 'umd'
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: 'client.js',
				format: 'umd'
			}
		],
		plugins: [
			...getBaseRollupPlugins(),
			// webpack resolve alias
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({name, description, version}) => ({
					name: name,
					main: 'index.js',
					peerDependencies: {
						react: {
							version
						}
					},
					description,
					version
				})
			})
		]
	}
	// jsx-runtime
	// {
	// 	input: `${pkgPath}/src/jsx.ts`,
	// 	output: [
	// 		// jsx-runtime
	// 		{
	// 			file: `${pkgDistPath}/jsx-runtime.js`,
	// 			name: 'jsx-runtime',
	// 			format: 'umd'
	// 		},
	// 		// jsx-dev-runtime
	// 		{
	// 			file: `${pkgDistPath}/jsx-dev-runtime.js`,
	// 			name: 'jsx-dev-runtime',
	// 			format: 'umd'
	// 		}
	// 	],
	// 	plugins: getBaseRollupPlugins()
	// }
];
