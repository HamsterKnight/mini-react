import path from 'path';
import fs from 'fs';

import cjs from '@rollup/plugin-commonjs';
import ts from 'rollup-plugin-typescript2';

// 公共打包路径前缀
const commonCompilePath = path.resolve(__dirname, '../../packages');

// 公共输出路径前缀
const commonDistPath = path.resolve(__dirname, '../../dist/node_modules');

// 获取路径
export const resolvePkgPath = (packageName, ifDist) => {
	if (ifDist) {
		return `${commonDistPath}/${packageName}`;
	}
	return `${commonCompilePath}/${packageName}`;
};

// 获取包的package.json的内容
export function getPackageJSON(pkgName) {
	// ...包路径
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, {encoding: 'utf-8'});
	return JSON.parse(str);
}

// 获取rollup的公共配置
export function getBaseRollupPlugins({
	alias = {
		__DEV__: true,
		preventAssignment: true
	},
	typescript = {}
} = {}) {
	return [cjs(), ts(typescript)];
}
