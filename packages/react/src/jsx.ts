import {REACT_ELEMENT_TYPE} from 'shared/ReactSymbols';
import {
	Key,
	Type,
	Ref,
	Props,
	ReactElementType,
	ElementType
} from 'shared/ReactTypes';

// ReactElement
export const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'zengsx'
	};
	return element;
};

export const jsx = function (type: ElementType, config, ...maybeChildren) {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key' && val !== undefined) {
			key = config[val];
		}
		if (prop === 'ref' && val !== undefined) {
			ref = config[val];
		}
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}
	const childrenLen = maybeChildren.length;
	if (childrenLen) {
		// 只有一个子元素
		if (childrenLen === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}
	return ReactElement(type, key, ref, props);
};
