<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-col items-center">
  <div class="w-full max-w-screen-2xl">
    {@render children()}
  </div>
</div>
