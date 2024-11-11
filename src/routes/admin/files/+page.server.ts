import { fail, redirect } from '@sveltejs/kit';
import { format } from 'date-fns';
import { writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Fetch data or perform other server-side logic here
	return {
		files: [], // Replace with actual data
	};
};

export const actions: Actions = {
	upload: async ({ request }) => {
		const data = await request.formData();
		const file = data.get('file') as File;

		if (!file) {
			return fail(400, { error: 'No file provided' });
		}

		if (!validateImage(file)) {
			return fail(400, { error: 'Invalid file type. Only images are allowed.' });
		}

		const optimizedImages = await compressAndResizeImage(file);

		await Promise.all(
			optimizedImages.map(({ name, buffer }) => writeFile(`static/uploads/${name}`, buffer)),
		);

		return { success: true };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const fileId = data.get('fileId');

		if (!fileId) {
			return { error: 'No file ID provided' };
		}

		// Handle file deletion logic here

		return { success: true };
	},
};

const validateImage = (file: File) => {
	const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
	const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

	const fileMimeType = file.type;
	const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

	if (!allowedMimeTypes.includes(fileMimeType) || !allowedExtensions.includes(fileExtension)) {
		return false;
	}

	return true;
};

const compressAndResizeImage = async (file: File) => {
	const buffer = await file.arrayBuffer();
	const image = sharp(buffer);
	const metadata = await image.metadata();

	const date = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
	const fileName = path.parse(file.name).name;

	const widths = [320, 640, 800, 1024, 1200];
	const optimizedImages: { name: string; buffer: Buffer }[] = [];

	for (const [i, width] of widths.entries()) {
		if (i > 0 && (metadata.width ?? 0) < width) continue;

		const optimizedBuffer = await sharp(buffer).resize(width).avif().toBuffer();
		optimizedImages.push({ name: `${date}_${fileName}_${width}.avif`, buffer: optimizedBuffer });
	}

	return optimizedImages;
};
