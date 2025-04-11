<script lang="ts">
  import { TypeWriter } from '$utils/TypeWriter';
  import { Popover, ProgressRing } from '@skeletonlabs/skeleton-svelte';
  import geminiLogo from '../../assets/gemini-logo.svg';

  let chatbotMenuOpen = $state(false);

  let { value = $bindable() }: { value: string | FormDataEntryValue | undefined } = $props();

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

    const promptWithValue =
      typeof value === 'string' && value.trim().length ? `${prompt}: ${value}` : prompt;

    const response = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ prompt: promptWithValue }),
    });

    if (!response.ok) {
      console.error(await response.json());
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    typeWriter.clear();

    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;

      let decodedChunk = decoder.decode(chunk, { stream: true });
      if (decodedChunk.startsWith('```html')) {
        decodedChunk = decodedChunk.slice(7);
      }
      if (decodedChunk.endsWith('```')) {
        decodedChunk = decodedChunk.slice(0, -3);
      }

      typeWriter.add(decodedChunk);
    }
    const finalChunk = decoder.decode();
    typeWriter.add(finalChunk);

    waitingForAnswer = false;
  };
</script>

<div class="absolute right-3 bottom-3">
  <Popover
    open={chatbotMenuOpen}
    onOpenChange={({ open }) => (chatbotMenuOpen = open)}
    positioning={{ placement: 'top-end' }}
    triggerBase="preset-filled btn-icon h-8 w-8 animate-pulse border-2 rounded-full border-[#004a77] p-2 shadow-xl"
    contentBase="card w-96 p-4 bg-surface-900 shadow-xl"
  >
    {#snippet trigger()}
      <img src={geminiLogo} alt="Gemini Logo" />
    {/snippet}
    {#snippet content()}
      <div class="p-2">
        <h3 class="h5">Ask Gemini!</h3>
      </div>
      <hr class="my-2" />
      {#each promptRecommendations as recommendation}
        <button
          type="button"
          onclick={async () => {
            prompt = recommendation;
            await askGemini();
          }}
          class="hover:bg-surface-800 inline-block w-full rounded-md p-2 text-left"
        >
          {recommendation}
        </button>
      {/each}

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
          class="preset-filled-primary-500 btn mt-4"
        >
          {#if waitingForAnswer}
            <span>&nbsp;</span>
            <ProgressRing value={null} size="w-5" />
            <span>&nbsp;</span>
          {:else}
            Send
          {/if}
        </button>
      </div>
    {/snippet}
  </Popover>
</div>
