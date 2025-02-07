import type { FormNode } from './node';

export interface FormTree {
  id: string;
  name: string;
  description?: string;
  nodes: FormNode[];
}
