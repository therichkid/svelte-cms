import type { Part } from '@google/generative-ai';

const MAX_HISTORY_LENGTH = 10;

type ChatHistory = { role: 'user' | 'model'; parts: Part[] }[];

class ChatHistoryStore {
  private userChatHistories: Map<number, ChatHistory> = new Map();

  getHistory(userId: number): ChatHistory | undefined {
    return this.userChatHistories.get(userId);
  }

  addToHistory(userId: number, role: 'user' | 'model', parts: Part[]) {
    let history = this.userChatHistories.get(userId);
    if (!history) history = [];

    history.push({ role, parts });

    if (history.length > MAX_HISTORY_LENGTH) history.shift();

    this.userChatHistories.set(userId, history);
  }
}

const chatHistoryStore = new ChatHistoryStore();

export { chatHistoryStore };
