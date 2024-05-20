import internals from 'shared/internals';
import {FiberNode} from './fiber';
import {Dispatch, Dispatcher} from 'react/src/currentDispatch';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	processUpdateQueue
} from './updateQueue';
import {Action} from 'shared/ReactTypes';
import {scheduleUpdateOnFiber} from './workLoop';

// 当前正在处理的函数
let currentlyRenderingFiber: FiberNode | null = null;
// 当前正在处理的hook
let workInProgressHook: Hook | null = null;

let currentHook: Hook | null = null;

const {currentDispatch} = internals;

interface Hook {
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}
export function renderWithHooks(wip: FiberNode) {
	// 渲染前的赋值操作
	currentlyRenderingFiber = wip;

	// 重置hooks链表
	wip.memoizedState = null;

	const current = wip.alternate;

	if (current !== null) {
		// update状态
		currentDispatch.current = HooksDispatcherOnUpdate;
	} else {
		// mount状态
		currentDispatch.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;

	// FC render
	const children = Component(props);

	// 重置操作
	currentlyRenderingFiber = null;
	workInProgressHook = null;
	currentHook = null;
	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

const HooksDispatcherOnUpdate: Dispatcher = {
	useState: updateState
};

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 找到当前useState对应的hook数据,mount的时候创建第一个hook的数据
	const hook = mountWorkInProgressHook();
	let memoizedState;
	if (initialState instanceof Function) {
		memoizedState = initialState();
	} else {
		memoizedState = initialState;
	}

	// 因为useState是要触发更新的,所以需要创建一个更新队列
	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;
	hook.memoizedState = memoizedState;

	// dispatch方法是可以脱离函数组件使用的，所以需要使用bind来绑定对应的fiber
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
	queue.dispatch = dispatch;

	return [memoizedState, dispatch];
}

function updateState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 找到当前useState对应的hook数据
	const hook = updateWorkInProgressHook();

	// 计算新state逻辑
	const queue = hook.updateQueue as UpdateQueue<State>;
	const pending = queue.shared.pending;

	if (pending !== null) {
		const {memoizedState} = processUpdateQueue(hook.memoizedState, pending);
		hook.memoizedState = memoizedState;
	}

	return [hook.memoizedState, queue.dispatch as Dispatch<State>];
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber);
}

// 创建hook并形成hooks链表
function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	};
	// mount时的第一个hook
	if (workInProgressHook === null) {
		// 如果不是在react的函数组件内调用currentlyRenderingFiber会为 null，直接抛出错误
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
		// mount时 后续的hook
	} else {
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}

function updateWorkInProgressHook(): Hook {
	// TODO render阶段触发的更新
	let nextCurrentHook: Hook | null;
	if (currentHook === null) {
		// 这是这个FC update时的第一个hook
		// TODO 为什么是从alternate拿的
		const current = currentlyRenderingFiber?.alternate;
		if (current !== null) {
			nextCurrentHook = current?.memoizedState;
		} else {
			// mount情况
			nextCurrentHook = null;
		}
	} else {
		// 这个FC update时后续的hook
		nextCurrentHook = currentHook.next;
	}
	currentHook = nextCurrentHook as Hook;

	// 这里就是处理用条件判断来决定是否定义hook的情况
	if (nextCurrentHook === null) {
		// 正常执行的情况
		// mount/update u1 u2 u3
		// 突然多一个u4，nextCurrentHook会是空
		// update u1 u2 u3 u4
		throw new Error(`${currentlyRenderingFiber?.type}本次执行的hook比上次的多`);
	}

	const newHook: Hook = {
		memoizedState: currentHook.memoizedState,
		updateQueue: currentHook.updateQueue,
		next: null
	};

	if (workInProgressHook === null) {
		// 如果不是在react的函数组件内调用currentlyRenderingFiber会为 null，直接抛出错误
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用');
		} else {
			workInProgressHook = newHook;
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
		// mount时 后续的hook
	} else {
		workInProgressHook.next = newHook;
		workInProgressHook = newHook;
	}
	return workInProgressHook;
}
