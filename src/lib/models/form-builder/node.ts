import type { FormElementRef } from './element';

interface BaseNode {
  id: string;
  ref: FormElementRef;
  cssClasses?: string;
  containerCssClasses?: string;
}

interface BaseTextNode extends BaseNode {
  ref: FormElementRef.Heading | FormElementRef.Paragraph;
  text: string;
}

interface BaseFormNode extends BaseNode {
  ref:
    | FormElementRef.Input
    | FormElementRef.Date
    | FormElementRef.Textarea
    | FormElementRef.Select
    | FormElementRef.Radio
    | FormElementRef.Checkbox
    | FormElementRef.Button;
  name: string;
  label?: string;
}

export interface HeadingNode extends BaseTextNode {
  ref: FormElementRef.Heading;
}

export interface ParagraphNode extends BaseTextNode {
  ref: FormElementRef.Paragraph;
}

export interface InputNode extends BaseFormNode {
  ref: FormElementRef.Input;
  type: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
}

export interface DateNode extends BaseFormNode {
  ref: FormElementRef.Date;
  includeTime?: boolean;
  min?: string;
  max?: string;
}

export interface TextareaNode extends BaseFormNode {
  ref: FormElementRef.Textarea;
  rows: number;
  placeholder?: string;
}

export interface SelectNode extends BaseFormNode {
  ref: FormElementRef.Select;
  options: string[];
  multiple?: boolean;
}

export interface RadioNode extends BaseFormNode {
  ref: FormElementRef.Radio;
  options: string[];
}

export interface CheckboxNode extends BaseFormNode {
  ref: FormElementRef.Checkbox;
  options: string[];
}

export interface ButtonNode extends BaseFormNode {
  ref: FormElementRef.Button;
  action: 'submit' | 'reset';
}

export type FormNode =
  | HeadingNode
  | ParagraphNode
  | InputNode
  | DateNode
  | TextareaNode
  | SelectNode
  | CheckboxNode
  | RadioNode
  | ButtonNode;
