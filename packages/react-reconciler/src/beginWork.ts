import {ReactElementType} from 'shared/ReactTypes';
import {FiberNode} from './fiber';
import {UpdateQueue, processUpdateQueue} from './updateQueue';
import {FunctionComponent, HostComponent, HostRoot, HostText} from './workTags';
import {mountChildFibers, reconcilerChildFibers} from './childFiberReconciler';
import {renderWithHooks} from './fiberHooks';

// 递归中递的阶段
export const beginWork = (wip: FiberNode) => {
	// 比较，返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			// 递归到最后的叶子节点后，不再往下执行
			return null;
		case FunctionComponent:
			return updateFunctionComponent(wip);
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			return null;
	}
};

function updateFunctionComponent(wip: FiberNode) {
	const nextChildren = renderWithHooks(wip);
	reconcilerChildren(wip, nextChildren);
	return wip.child;
}

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;

	//  TODO 这里不懂为什么是计算后的ReactElement,一些多余的属性不知道从哪里来的
	// 解答：首屏渲染及调度更新结合时的方法updateContainer执行，会将需要更新的ReactElement放到队列中(也就是updateQueue.shared.pending)
	// memoizedState得到的就是计算后的ReactElement
	const {memoizedState} = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	const nextChildren = wip.memoizedState;

	reconcilerChildren(wip, nextChildren);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcilerChildren(wip, nextChildren);
	return wip.child;
}

function reconcilerChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;
	// TODO 好像只有hostRootFiber有alternate
	// 无论是否是首屏挂载的时候，hostRootFiber也会进入一次该流程,连接child属性，及return属性
	if (current !== null) {
		// 更新流程update
		wip.child = reconcilerChildFibers(wip, current?.child, children);
	} else {
		// 首屏挂载流程mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
