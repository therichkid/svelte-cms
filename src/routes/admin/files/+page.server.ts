import { db } from '$lib/server/db';
import { fileMeta as fileMetaTable } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import { unlink, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import type { Actions, PageServerLoad } from './$types';

interface OptimizedImage {
  name: string;
  width: number;
  buffer: Buffer;
}

export const load: PageServerLoad = async () => {
  const files = await db.select().from(fileMetaTable);

  return {
    files,
  };
};

export const actions: Actions = {
  upload: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { error: 'Unauthorized' });
    }

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

    const fileMeta = await storeFileMeta(file, optimizedImages, locals.user.id);

    return { file: fileMeta };
  },

  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id');

    if (!id || typeof id !== 'string') {
      return fail(400);
    }

    const [file] = await db
      .select()
      .from(fileMetaTable)
      .where(eq(fileMetaTable.id, parseInt(id)));

    if (!file) {
      return fail(404, { error: 'File not found' });
    }

    const sources = file.sources as { name: string }[];
    await Promise.all(
      sources.map(({ name }) => {
        return unlink(`static/uploads/${name}`);
      }),
    );

    await db.delete(fileMetaTable).where(eq(fileMetaTable.id, parseInt(id)));

    return { status: 204 };
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
  const optimizedImages: OptimizedImage[] = [];

  for (const [i, width] of widths.entries()) {
    if (i > 0 && (metadata.width ?? 0) < width) continue;

    const optimizedBuffer = await sharp(buffer).resize(width).avif().toBuffer();
    optimizedImages.push({
      name: `${date}_${fileName}_${width}.avif`,
      width,
      buffer: optimizedBuffer,
    });
  }

  return optimizedImages;
};

const storeFileMeta = async (file: File, optimizedImages: OptimizedImage[], userId: number) => {
  const fileName = path.parse(file.name).name;
  const largestImage = [...optimizedImages].pop();

  const [result] = await db
    .insert(fileMetaTable)
    .values({
      name: fileName,
      mimeType: 'image/avif',
      size: largestImage?.buffer.byteLength ?? 0,
      sources: optimizedImages.map(({ name, width }) => ({ name, width })),
      userId,
    })
    .returning();

  return result;
};
