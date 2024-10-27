import { env } from '$env/dynamic/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addChatHistory, getChatHistory } from './history';

if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const modelId = 'gemini-1.5-flash';
const model = genAI.getGenerativeModel({ model: modelId });

export const generateResponse = async (sessionId: string, prompt: string) => {
	if (!sessionId) {
		throw new Error('No valid session ID provided');
	}
	if (!prompt) {
		throw new Error('No prompt provided');
	}

	try {
		const chat = model.startChat({
			history: getChatHistory(sessionId),
			generationConfig: {
				maxOutputTokens: 100,
				temperature: 0.7,
			},
		});

		const result = await chat.sendMessage(prompt);
		const response = await result.response;
		const responseText = response.text();

		addChatHistory(sessionId, 'user', [{ text: prompt }]);
		addChatHistory(sessionId, 'model', [{ text: responseText }]);

		return responseText;
	} catch (e) {
		throw new Error(`Failed to generate response: ${e}`);
	}
};
