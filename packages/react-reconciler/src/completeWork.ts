import {
	Container,
	Instance,
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';
import {FiberNode} from './fiber';
import {FunctionComponent, HostComponent, HostRoot, HostText} from './workTags';
import {NoFlags, Update} from './fiberFalgs';

function markUpdate(fiber: FiberNode) {
	fiber.flags |= Update;
}

// completeWork是向上遍历的过程， 所以遍历到的节点是最靠上的节点，
// 然后每次都运行bubbleProperties，这样就将当前节点中的子节点及兄弟节点的包含的flag副作用
// 都冒泡当当前节点的subtreeFlags中，这样一直冒泡到根节点，如果根节点的subtreesFlags也就包含了
// 所有的flags副作用，这样就能知道子树是否包含副作用，这样就可以向下遍历，寻找需要变更的子树
export const completeWork = (wip: FiberNode) => {
	// 递归中的归

	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// 更新流程update
			} else {
				// 1. 构建DOM

				const instance = createInstance(wip.type, newProps);
				// 2. 将DOM插入到DOM树中
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostText:
			if (current !== null && wip.stateNode) {
				// 更新流程update
				const oldText = current.memoizedProps.content;
				const newText = newProps.content;
				if (oldText !== newText) {
					markUpdate(wip);
				}
			} else {
				// 1. 构建DOM

				const instance = createTextInstance(newProps.content);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostRoot:
			bubbleProperties(wip);
			return null;
		case FunctionComponent:
			bubbleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.warn('未处理的completeWork情况', wip);
			}
			break;
	}
	return null;
};

function appendAllChildren(parent: Container | Instance, wip: FiberNode) {
	let node = wip.child;

	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			// TODO 这里也有点疑问，就是这里真的会进来吗
			node.child.return = node;
			node = node.child;
			continue;
		}

		// 归结束
		if (node === wip) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(wip: FiberNode) {
	let subTreeFlags = NoFlags;
	let child = wip.child;
	// 逻辑或的方式，兼并标记
	while (child !== null) {
		subTreeFlags |= child.subtreeFlags;
		subTreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}
	wip.subtreeFlags |= subTreeFlags;
}
