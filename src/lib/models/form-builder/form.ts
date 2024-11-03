import type { FormNode } from './nodes';

export interface FormTree {
	id: string;
	name: string;
	description?: string;
	nodes: FormNode[];
}
