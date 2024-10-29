<script lang="ts">
	import { TextAnimator } from '$utils/TextAnimator.svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import geminiLogo from '../../assets/gemini-logo.svg';

	const menuPopup: PopupSettings = {
		event: 'click',
		target: 'chatbotMenu',
		placement: 'top-end',
	};

	let { value = $bindable() }: { value: string } = $props();

	let prompt = $state('');
	let waitingForAnswer = $state(false);

	const textAnimator = new TextAnimator();
	$effect(() => {
		value = textAnimator.animatedText;
	});

	const promptRecommendations = [
		'TL;DR',
		"Explain like I'm 5",
		'Check grammar and spelling',
		'Add more content',
		'Make it more concise',
	];

	const askChatbot = async () => {
		waitingForAnswer = true;

		const promptWithValue = value?.trim().length ? `${prompt}: ${value}` : prompt;

		const response = await fetch('/api/ai', {
			method: 'POST',
			body: JSON.stringify({ prompt: promptWithValue }),
		});

		if (!response.ok) {
			throw new Error('Failed to send request');
		}

		const reader = response.body!.getReader();
		const decoder = new TextDecoder();

		textAnimator.reset();
		while (true) {
			const { done, value: chunk } = await reader.read();
			if (done) break;

			const decodedChunk = decoder.decode(chunk, { stream: true });
			textAnimator.addText(decodedChunk);
		}
		const finalChunk = decoder.decode();
		textAnimator.addText(finalChunk);

		waitingForAnswer = false;
	};
</script>

<div class="absolute bottom-3 right-3">
	<button type="button" use:popup={menuPopup} class="variant-filled btn btn-icon btn-xl p-1">
		<img src={geminiLogo} alt="Gemini Logo" />
	</button>

	<div class="card w-96 p-4 shadow-xl" data-popup="chatbotMenu">
		<div class="p-2">
			<h2 class="h4 font-bold">Ask Gemini!</h2>
		</div>
		<ul class="list-nav">
			{#each promptRecommendations as recommendation}
				<li>
					<button
						type="button"
						onclick={async () => {
							prompt = recommendation;
							await askChatbot();
						}}
						class="w-full text-left"
					>
						{recommendation}
					</button>
				</li>
			{/each}
		</ul>

		<div class="py-2">
			<input
				type="text"
				name="prompt"
				bind:value={prompt}
				required
				placeholder="Ask me anything..."
				class="input"
			/>
			<button type="button" onclick={askChatbot} class="variant-filled-primary btn mt-4">
				{#if waitingForAnswer}
					<span class="loading loading-spinner"></span>
				{:else}
					<span>Send</span>
				{/if}
			</button>
		</div>
	</div>
</div>
