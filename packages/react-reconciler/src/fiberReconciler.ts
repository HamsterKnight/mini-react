import {Container} from 'hostConfig';
import {FiberNode, FiberRootNode} from './fiber';
import {HostRoot} from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import {ReactElementType} from 'shared/ReactTypes';
import {scheduleUpdateOnFiber} from './workLoop';

// 在React.createRoot()的时候被调用,创建整个应用的根节点fiberRootNode
export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

// 将首屏渲染，与触发更新的机制串联起来
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element);

	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	// 开始调度
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
