export const slugify = (input: string | undefined) => {
	if (!input) return '';

	let slug = input.toLowerCase().trim();

	// Removes accents
	slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	// Replaces any character that is not a letter, number, space or hyphen with a space
	slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

	// Replaces any sequence of spaces or hyphens with a single hyphen
	slug = slug.replace(/[\s-]+/g, '-');

	return slug;
};
