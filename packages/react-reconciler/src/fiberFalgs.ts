export type Flags = number;

// 没有标记
export const NoFlags = 0b0000001;
// 插入
export const Placement = 0b0000010;
// 更新
export const Update = 0b0000100;
// 删除孩子
export const ChildDeletion = 0b0001000;

export const MutationMask = Placement | Update | ChildDeletion;
