import {Key, Props, ReactElementType, Ref, Type} from 'shared/ReactTypes';
import {FunctionComponent, HostComponent, WorkTag} from './workTags';
import {Flags, NoFlags} from './fiberFalgs';
import {Container} from 'hostConfig';

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
	memoizedState: any; // 最终状态
	alternate: FiberNode | null;
	flags: Flags;
	subtreeFlags: Flags; // 代表子树中的副作用

	updateQueue: unknown;

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
		// 作为工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.updateQueue = null;
		this.memoizedState = null;
		// 记录替换的filerTree
		this.alternate = null;
		// 副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container; // 挂载原生宿主环境的节点
	current: FiberNode;
	finishedWork: FiberNode | null; //保存整个递归流程已经完成的hostRootFiber
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;

	// 首屏渲染，workingInProgress会是null
	if (wip === null) {
		//mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.type = current.type;
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		// 清除上一次的副作用
		wip.flags = NoFlags;
		wip.subtreeFlags = NoFlags;
	}
	wip.type = current.type;
	// updateQueue的结构设着，是为了让状态对象共用
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;
	return wip;
};

export function createFiberFromElement(element: ReactElementType) {
	const {type, key, props} = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		// <div /> type: 'div'
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('为定义的type类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
