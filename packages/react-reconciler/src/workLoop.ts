import {beginWork} from './beginWork';
import {commitMutationEffects} from './commitWork';
import {completeWork} from './completeWork';
import {FiberNode, FiberRootNode, createWorkInProgress} from './fiber';
import {MutationMask, NoFlags} from './fiberFalgs';
import {HostRoot} from './workTags';

// 记录当前处理的fiber节点
let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}
// 实现调度功能
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	const root = markUpdateFromFiberToRoot(fiber);
	// 进行渲染
	renderRoot(root);
}

// 从触发更新的fiber开始，寻找最顶层的fiberNode
export function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			// 更新流程
			workLoop();
			break;
		} catch (e) {
			// 已经声明__DEV__知道为什么不生效,只能在根目录下生效
			if (__DEV__) {
				console.log('workLoop发生错误', e);
			}

			workInProgress = null;
		}
		// eslint-disable-next-line no-constant-condition
	} while (true);
	// 这样root.current.alternate上就是我们构建好的fiber树

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	// 执行渲染
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;
	if (finishedWork === null) {
		return;
	}
	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork);
	}
	// finishedWork 使用完毕，重置
	root.finishedWork = null;

	// 判断是否存在三个子阶段需要执行的操作
	// root flags root subtreeFlags
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect && rootHasEffect) {
		// beforeMutation

		// mutation Placement

		commitMutationEffects(finishedWork);
		// 进行fiber树的切换，发生在layout之前
		root.current = finishedWork;
		// layout
	} else {
		root.current = finishedWork;
	}
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	const next: FiberNode | null = beginWork(fiber);
	// 生成fiber后，当前pendingProps就是缓存的props
	fiber.memoizedProps = fiber.pendingProps;

	// 当递到最深层级后，执行归操作
	if (next === null) {
		// 没有子节点则开始遍历兄弟节点
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		// 处理完当前节点后，再处理兄弟节点，处理完兄弟节点再处理父节点
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node?.return;
		workInProgress = node;
	} while (node !== null);
}
