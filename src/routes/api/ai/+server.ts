import { generateResponse } from '$lib/server/ai';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async (event: RequestEvent) => {
  const { user } = event.locals;
  if (!user) {
    return error(401, { message: 'Unauthorized' });
  }

  const data = await event.request.json();
  const { prompt } = data;
  if (!validatePrompt(prompt)) {
    return error(400, { message: 'Invalid prompt' });
  }

  const response = await generateResponse(user.id, prompt);
  return new Response(response);
};

const validatePrompt = (prompt: unknown): prompt is string => {
  return typeof prompt === 'string' && prompt.length > 0;
};
