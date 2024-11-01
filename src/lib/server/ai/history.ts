import type { Part } from '@google/generative-ai';

type ChatHistory = Map<number, { role: 'user' | 'model'; parts: Part[] }[]>;

const MAX_HISTORY_LENGTH = 10;

const chatHistory: ChatHistory = new Map();

export const getChatHistory = (userId: number) => {
	return chatHistory.get(userId) || [];
};

export const addChatHistory = (userId: number, role: 'user' | 'model', parts: Part[]) => {
	let history = chatHistory.get(userId);
	if (!history) {
		history = [];
		chatHistory.set(userId, history);
	}

	history.push({ role, parts });

	if (history.length > MAX_HISTORY_LENGTH) {
		history.shift();
	}
};
