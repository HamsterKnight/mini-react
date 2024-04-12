import {Key, Props, Ref, Type} from 'shared/ReactTypes';
import {WorkTag} from './workTags';
import {Flags, NoFlags} from './fiberFalgs';

export class FiberNode {
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	type: Type;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	alternate: FiberNode | null;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 当前react元素的类型
		this.tag = tag;
		this.key = key;
		// 保存当前fiberNode的dom节点
		this.stateNode = null;
		// 当前dom节点的类型
		this.type = null;

		/** 构成树状结构 */
		// 指向父亲fiberNode
		this.return = null;
		// 指向右侧兄弟fiberNode
		this.sibling = null;
		this.child = null;
		// 比如当前有li*3,index表示当前标签索引位置
		this.index = 0;

		this.ref = null;

		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		// 记录替换的filerTree
		this.alternate = null;
		// 副作用
		this.flags = NoFlags;
	}
}
