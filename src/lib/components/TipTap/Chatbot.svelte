<script lang="ts">
	import { TypeWriter } from '$utils/TypeWriter';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup, ProgressRadial } from '@skeletonlabs/skeleton';
	import geminiLogo from '../../assets/gemini-logo.svg';

	const menuPopup: PopupSettings = {
		event: 'click',
		target: 'chatbotMenu',
		placement: 'top-end',
	};

	let { value = $bindable() }: { value: string } = $props();

	let prompt = $state('');
	let waitingForAnswer = $state(false);

	const typeWriter = new TypeWriter((typedText) => {
		value = typedText;
	});

	const promptRecommendations = [
		'TL;DR',
		"Explain like I'm 5",
		'Check grammar and spelling',
		'Add more content',
		'Make it more concise',
	];

	const askGemini = async () => {
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
		typeWriter.clear();

		while (true) {
			const { done, value: chunk } = await reader.read();
			if (done) break;

			const decodedChunk = decoder.decode(chunk, { stream: true });
			typeWriter.add(decodedChunk);
		}
		const finalChunk = decoder.decode();
		typeWriter.add(finalChunk);

		waitingForAnswer = false;
	};
</script>

<div class="absolute bottom-3 right-3">
	<button
		type="button"
		use:popup={menuPopup}
		class="variant-filled btn-icon h-14 w-14 animate-pulse border-2 border-[#004a77] p-2 shadow-xl"
	>
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
							await askGemini();
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
				placeholder="Ask me anything..."
				class="input"
			/>
			<button
				type="button"
				onclick={askGemini}
				disabled={!prompt || waitingForAnswer}
				class="variant-filled-primary btn mt-4"
			>
				{#if waitingForAnswer}
					<span>&nbsp;</span>
					<ProgressRadial class="w-5" />
					<span>&nbsp;</span>
				{:else}
					Send
				{/if}
			</button>
		</div>
	</div>
</div>
