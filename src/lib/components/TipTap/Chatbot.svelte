<script lang="ts">
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import geminiLogo from '../../assets/gemini-logo.svg';

	const menuPopup: PopupSettings = {
		event: 'click',
		target: 'chatbotMenu',
		placement: 'top-end',
	};

	let { value = $bindable() }: { value: string } = $props();

	let promptInput: HTMLInputElement;

	let isInteracting = $state(false);

	const promptRecommendations = [
		'TL;DR',
		"Explain like I'm 5",
		'Check grammar and spelling',
		'Add more content',
		'Make it more concise',
	];

	const setPrompt = (prompt: string) => {
		promptInput.value = prompt;
	};

	const interactWithChatbot = async () => {
		isInteracting = true;

		let prompt = promptInput.value;
		prompt += `: ${value}`;

		const response = await fetch('/api/ai', {
			method: 'POST',
			body: JSON.stringify({ prompt }),
		});

		if (!response.ok) {
			throw new Error('Failed to send request');
		}

		const reader = response.body!.getReader();
		const decoder = new TextDecoder();

		value = '';
		while (true) {
			const { done, value: chunk } = await reader.read();
			if (done) break;

			value += decoder.decode(chunk, { stream: true });
		}
		value += decoder.decode();

		console.log(value);

		isInteracting = false;
	};
</script>

<div class="absolute bottom-3 right-3">
	<button use:popup={menuPopup} class=" variant-filled btn btn-icon btn-xl p-1">
		<img src={geminiLogo} alt="Gemini Logo" />
	</button>

	<div class="card w-96 p-4 shadow-xl" data-popup="chatbotMenu">
		<div class="p-2">
			<h2 class="h4 font-bold">Ask Gemini!</h2>
		</div>
		<ul class="list-nav">
			{#each promptRecommendations as prompt}
				<li>
					<button
						onclick={async () => {
							setPrompt(prompt);
							await interactWithChatbot();
						}}
						class="w-full text-left"
					>
						{prompt}
					</button>
				</li>
			{/each}
		</ul>

		<div class="py-2">
			<form onsubmit={interactWithChatbot}>
				<input
					type="text"
					name="prompt"
					bind:this={promptInput}
					required
					placeholder="Ask me anything..."
					class="input"
				/>
				<button class="variant-filled-primary btn mt-4">
					{#if isInteracting}
						<span class="loading loading-spinner"></span>
					{:else}
						<span>Send</span>
					{/if}
				</button>
			</form>
		</div>
	</div>
</div>
