import { env } from '$env/dynamic/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addChatHistory, getChatHistory } from './history';

if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const modelId = 'gemini-1.5-flash';
const model = genAI.getGenerativeModel({
	model: modelId,
	systemInstruction:
		"Don't output markup, instead use HTML. Titles are <h1>, <h2>,... and paragraphs are <p>. Use <br> for line breaks.",
});

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
				maxOutputTokens: 256,
				temperature: 0.7,
			},
		});

		const { stream } = await chat.sendMessageStream(prompt);

		let responseText = '';

		const encoder = new TextEncoder();
		const responseStream = new ReadableStream<Uint8Array>({
			async start(controller) {
				for await (const chunk of stream) {
					const chunkText = chunk.candidates?.[0].content.parts[0].text;

					if (!chunkText) {
						continue;
					}

					controller.enqueue(encoder.encode(chunkText));

					responseText += chunkText;
				}

				controller.close();

				addChatHistory(sessionId, 'user', [{ text: prompt }]);
				addChatHistory(sessionId, 'model', [{ text: responseText }]);
			},
		});

		return responseStream;
	} catch (e) {
		throw new Error(`Failed to generate response: ${e}`);
	}
};
