import {Action} from 'shared/ReactTypes';
export interface Update<State> {
	action: Action<State>;
}

// 有个pending状态记录更新状态
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

// 更新的数据结构
export const createUpdate = <State>(action: Action<State>) => {
	return {
		action
	};
};

// 保存update的数据结构
export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};

// 往队列中增加更新状态
export const enqueueUpdate = <Action>(
	UpdateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	UpdateQueue.shared.pending = update;
};

// 消费队列中的状态
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): {memoizedState: State} => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		// 有两种更新状态要处理，
		// 一个是传入一个更新函数
		if (action instanceof Function) {
			result.memoizedState = action(baseState);
			//一个是传入值
		} else {
			result.memoizedState = action;
		}
	}

	return result;
};
