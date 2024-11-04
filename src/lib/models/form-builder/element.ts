export interface FormElement {
	ref: FormElementRef;
	name: string;
	description: string;
}

export enum FormElementRef {
	Heading = 'heading',
	Paragraph = 'paragraph',
	Input = 'input',
	Date = 'date',
	Textarea = 'textarea',
	Select = 'select',
	Radio = 'radio',
	Checkbox = 'checkbox',
	Button = 'button',
}

export const FORM_ELEMENTS: FormElement[] = [
	{
		ref: FormElementRef.Heading,
		name: 'Heading',
		description: 'A large title to separate sections.',
	},
	{
		ref: FormElementRef.Paragraph,
		name: 'Paragraph',
		description: 'A block of text to provide more information.',
	},
	{
		ref: FormElementRef.Input,
		name: 'Input',
		description: 'A single line input for text, email, number, etc.',
	},
	{
		ref: FormElementRef.Date,
		name: 'Date',
		description: 'A date picker for selecting a date.',
	},
	{
		ref: FormElementRef.Textarea,
		name: 'Textarea',
		description: 'A multi-line input for longer text.',
	},
	{
		ref: FormElementRef.Select,
		name: 'Select',
		description:
			'A dropdown with multiple options. Decide if only one or multiple can be selected.',
	},
	{
		ref: FormElementRef.Checkbox,
		name: 'Checkbox',
		description: 'A list of options where multiple can be selected.',
	},
	{
		ref: FormElementRef.Radio,
		name: 'Radio',
		description: 'A list of options where only one can be selected.',
	},
	{
		ref: FormElementRef.Button,
		name: 'Button',
		description: 'A clickable button.',
	},
];
