export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElementType {
	type: Type;
	key: Key;
	ref: Ref;
	props: Props;
	__mark: string;
}
