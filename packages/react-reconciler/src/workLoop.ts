import {beginWork} from './beginWork';
import {completeWork} from './completeWork';
import {FiberNode} from './fiber';

// 记录当前处理的fiber节点
let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberNode) {
	workInProgress = fiber;
}

function renderRoot(root: FiberNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.log('workLoop发生错误', e);
			workInProgress = null;
		}
		// eslint-disable-next-line no-constant-condition
	} while (true);
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
