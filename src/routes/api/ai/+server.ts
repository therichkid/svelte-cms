import { generateAIResponse } from '$lib/server/ai';
import { validateSession } from '$lib/server/auth.js';
import { error, json } from '@sveltejs/kit';

export const POST = async (event) => {
	const data = await event.request.json();

	const { prompt } = data;
	if (!validatePrompt(prompt)) {
		return error(400, { message: 'Invalid prompt' });
	}

	const sessionId = event.locals.session?.id;
	if (!(await validateSessionId(sessionId))) {
		return error(401, { message: 'Unauthorized' });
	}

	const response = await generateAIResponse(sessionId as string, prompt);

	return json(response);
};

const validatePrompt = (prompt: unknown): prompt is string => {
	return typeof prompt === 'string' && prompt.length > 0;
};

const validateSessionId = async (sessionId: unknown): Promise<boolean> => {
	if (typeof sessionId !== 'string') return false;

	const { session } = await validateSession(sessionId);
	return session !== null;
};
