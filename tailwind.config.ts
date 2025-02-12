import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { join } from 'path';
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'media',

  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
  ],

  theme: {
    extend: {},
  },

  plugins: [forms, typography, skeleton({ themes: { preset: ['modern'] } })],
} satisfies Config;
