import {Action} from 'shared/ReactTypes';

export interface Dispatcher {
	useState: <T>(initialState: (() => T) | T) => [T, Dispatch<T>];
}
// 内部数据共享，保存当前当前阶段使用hook的集合
const currentDispatch: {current: Dispatcher | null} = {
	current: null
};

export type Dispatch<State> = (action: Action<State>) => void;

export const resolveDispatcher = (): Dispatcher => {
	const dispatcher = currentDispatch.current;
	if (dispatcher === null) {
		throw new Error('hooks只能在函数组件中使用');
	}
	return dispatcher;
};

export default currentDispatch;
