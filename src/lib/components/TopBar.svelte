<script lang="ts">
  import type { SessionValidationResult } from '$lib/server/auth/session';
  import { AppBar, Popover } from '@skeletonlabs/skeleton-svelte';

  let { user }: { user: SessionValidationResult['user'] | null } = $props();

  let optionsMenuOpen = $state(false);
</script>

<AppBar>
  {#snippet lead()}
    <a href="/" class="btn py-0">
      <h2 class="h3">Svelte CMS</h2>
    </a>
  {/snippet}

  {#snippet trail()}
    <Popover
      open={optionsMenuOpen}
      onOpenChange={({ open }) => (optionsMenuOpen = open)}
      positioning={{ placement: 'bottom-end' }}
      triggerBase="btn-icon h-10 w-10"
      contentBase="card w-72 p-4 bg-surface-800 shadow-xl"
    >
      {#snippet trigger()}
        {#if user}
          <img src="https://i.pravatar.cc/50?u={user.id}" class="rounded-full" alt="User avatar" />
        {:else}
          <span><i class="fas fa-ellipsis-h"></i></span>
        {/if}
      {/snippet}
      {#snippet content()}
        {#if user}
          <div class="p-2">
            <h3 class="h5">Welcome, {user.name}!</h3>
          </div>
          <hr class="my-2" />
          <a
            href="/profile"
            class="hover:bg-surface-700 inline-block w-full rounded-md p-2 text-left"
          >
            Profile
          </a>
          <a
            href="/logout"
            class="hover:bg-surface-700 inline-block w-full rounded-md p-2 text-left"
          >
            Logout
          </a>
        {:else}
          <div class="p-2">
            <h3 class="h5">Welcome!</h3>
          </div>
          <hr class="my-2" />
          <a
            href="/login"
            class="hover:bg-surface-700 inline-block w-full rounded-md p-2 text-left"
          >
            Login
          </a>
          <a
            href="/register"
            class="hover:bg-surface-700 inline-block w-full rounded-md p-2 text-left"
          >
            Register
          </a>
        {/if}
      {/snippet}
    </Popover>
  {/snippet}
</AppBar>
