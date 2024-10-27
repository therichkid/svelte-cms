import type { Part } from '@google/generative-ai';

type ChatHistory = Map<string, { role: 'user' | 'model'; parts: Part[] }[]>;

const MAX_HISTORY_LENGTH = 10;

const chatHistory: ChatHistory = new Map();

export const getChatHistory = (sessionId: string) => {
	return chatHistory.get(sessionId) || [];
};

export const addChatHistory = (sessionId: string, role: 'user' | 'model', parts: Part[]) => {
	let history = chatHistory.get(sessionId);
	if (!history) {
		history = [];
		chatHistory.set(sessionId, history);
	}

	history.push({ role, parts });

	if (history.length > MAX_HISTORY_LENGTH) {
		history.shift();
	}
};
