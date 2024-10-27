<script lang="ts">
	import geminiLogo from '../../assets/gemini-logo.svg';

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

		value = await response.json();

		isInteracting = false;
	};
</script>

<div class="absolute bottom-3 right-3">
	<div class="dropdown dropdown-end dropdown-top">
		<div tabindex="-1" role="button" class="btn btn-circle bg-white p-1 hover:bg-slate-200">
			<img src={geminiLogo} alt="Gemini Logo" />
		</div>
		<div tabindex="-1" class="menu dropdown-content z-[1] w-80 rounded-box bg-base-200 p-2 shadow">
			<div class="p-2">
				<h2 class="text-lg font-bold">Ask Gemini!</h2>
			</div>
			<ul>
				{#each promptRecommendations as prompt}
					<li class="py-2">
						<button
							onclick={async () => {
								setPrompt(prompt);
								await interactWithChatbot();
							}}>{prompt}</button
						>
					</li>
				{/each}
			</ul>

			<div class="p-2">
				<form onsubmit={interactWithChatbot}>
					<input
						type="text"
						name="prompt"
						bind:this={promptInput}
						required
						placeholder="Ask me anything..."
						class="input input-bordered w-full max-w-xs"
					/>
					<button class="btn btn-primary mt-4">
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
</div>
