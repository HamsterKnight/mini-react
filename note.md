1.使用 menorepo 来管理项目 2.使用 pnpm 来管理依赖
3.pnpm 使用 mororepo 方式来关系项目，需要新建一个 pnpm-workspace.yaml 文件 4.使用项目安装 eslint,`pnpm install eslint -D -w`,-w 的作用的依赖安装的根目录 5.初始化 eslint 配置规则`npx eslint --init`
初始化出来的新配置有点奇怪，最好还是用9.0之前的配置方式

```json
{
	"root": true,
	"extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": ["@typescript-eslint", "prettier"],
	"rules": {}
}
```

6.安装 typescript 的代码解释，及规则插件`pnpm i @typescript-eslint/parser @typescript-eslint/eslint-plugin` 7.安装 prettier`pnpm i prettier -D -w`,然后新增.prettierrc.json 文件
8.eslint 可能会和 prettier 会有冲突，所以将 prettier 集成到 eslint 中，安装插件`eslint-config-prettier、eslint-plugin-prettier`

> eslint-config-prettier: 是管理 prettier 和 eslint 冲突的规则
> eslint-plugin-prettier: 允许 eslint 用 prettier 格式化代码的能力。 安装依赖并修改.eslintrc 文件

9.commit 规范，使用 husky 10.安装 husky `pnpm i husky -D -w` 11. 初始化 husky `npx husky init` 12.将格式化命令纳入 commit 时 husky 执行的脚本，`echo "pnpm lint" > .husky/pre-commit`

```
husky是对git hooks工作流的一个管理，对husky不懂，可以去看看这篇文章，https://juejin.cn/post/7103889661465985038
```

13.pnpm lint 会对项目所有的内容进行检查，所以添加`lint-staged`库，只对暂存区的内容进行检查。 13.通过`commitlint、@commitlint/cli、@commitlint/config-conventional`，来对提交信息进行检查 14.增加配置文件`.commitlintrc.js`

```js
const Configuration = {
	/*
	 * Resolve and load @commitlint/config-conventional from node_modules.
	 * Referenced packages must be installed
	 */
	extends: ['@commitlint/config-conventional']
};

export default Configuration;
```

15.集成 commitlint 到 husky 中，`echo  'npx --no-install commitlint -e "$1"' > .husky/commit-msg`
16. 增加ts的配置文件`tsconfig.json`