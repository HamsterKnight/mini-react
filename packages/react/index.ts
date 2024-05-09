import currentDispatch, {
	Dispatcher,
	resolveDispatcher
} from './src/currentDispatch';
import {
	jsx,
	jsxDEV,
	createElement as createElementFn,
	isValidElement as isValidElementFn
} from './src/jsx';

export const useState: Dispatcher['useState'] = (initialState) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};

// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRE = {
	currentDispatch
};

export const version = '0.0.0';
// TODO 根据使用环境区分jsx/jsxDEV
export const createElement = createElementFn;

export const isValidElement = isValidElementFn;
