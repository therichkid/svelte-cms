import { FormElementRef, type FormElement } from '$lib/models/form-builder/element';
import type {
	DateNode,
	FormNode,
	HeadingNode,
	InputNode,
	ParagraphNode,
} from '$lib/models/form-builder/node';
import { v4 as uuidv4 } from 'uuid';

export const createNodeFromElement = (element: FormElement): FormNode => {
	switch (element.ref) {
		case FormElementRef.Heading:
			return createHeading();
		case FormElementRef.Paragraph:
			return createParagraph();
		case FormElementRef.Input:
			return createInput();
		case FormElementRef.Date:
			return createDate();
		case FormElementRef.Textarea:
			return createTextarea();
		case FormElementRef.Select:
			return createSelect();
		case FormElementRef.Checkbox:
			return createCheckbox();
		case FormElementRef.Radio:
			return createRadio();
		case FormElementRef.Button:
			return createButton();
		default:
			throw new Error(`Unknown element reference: ${element.ref}`);
	}
};

const createHeading = (): HeadingNode => {
	return {
		id: uuidv4(),
		ref: FormElementRef.Heading,
		text: 'A heading',
		cssClasses: 'h3',
		containerCssClasses: 'col-span-2',
	};
};

const createParagraph = (): ParagraphNode => {
	return {
		id: uuidv4(),
		ref: FormElementRef.Paragraph,
		text: 'A paragraph',
		containerCssClasses: 'col-span-2',
	};
};

const createInput = (): InputNode => {
	return {
		id: uuidv4(),
		ref: FormElementRef.Input,
		name: 'input',
		label: 'Input',
		type: 'text',
	};
};

const createDate = (): DateNode => {
	return {
		id: uuidv4(),
		ref: FormElementRef.Date,
		name: 'date',
		label: 'Date',
	};
};

const createTextarea = (): FormNode => {
	return {
		id: uuidv4(),
		ref: FormElementRef.Textarea,
		name: 'textarea',
		label: 'Textarea',
		rows: 4,
	};
};

const createSelect = (): FormNode => {
	return {
		id: uuidv4(),
		ref: FormElementRef.Select,
		name: 'select',
		label: 'Select',
		options: ['Option 1', 'Option 2', 'Option 3'],
	};
};

const createCheckbox = (): FormNode => {
	return {
		id: uuidv4(),
		ref: FormElementRef.Checkbox,
		name: 'checkbox',
		options: ['Checkbox'],
	};
};

const createRadio = (): FormNode => {
	return {
		id: uuidv4(),
		ref: FormElementRef.Radio,
		name: 'radio',
		options: ['Option 1', 'Option 2', 'Option 3'],
	};
};

const createButton = (): FormNode => {
	return {
		id: uuidv4(),
		ref: FormElementRef.Button,
		name: 'button',
		label: 'Submit',
		action: 'submit',
		cssClasses: 'variant-filled-primary',
	};
};
