export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0;
// 项目挂载的根节点类型
export const HostRoot = 3;
// 正常dom节点类型<div><div>
export const HostComponent = 5;
// 文本类型,比如<div>hello world</div>中的hello world
export const HostText = 6;
