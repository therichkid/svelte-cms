/** Works only in the browser! */
export const parseHtmlToText = (html: string) => {
	if (!html) return '';

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	return doc.body.textContent || '';
};
