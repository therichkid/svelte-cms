<script lang="ts">
  import { page } from '$app/stores';
  import { Navigation } from '@skeletonlabs/skeleton-svelte';
</script>

<Navigation.Rail>
  {#snippet tiles()}
    <Navigation.Tile href="/" label="Home" selected={$page.url.pathname === '/'}>
      <span><i class="fa-solid fa-home fa-xl"></i></span>
    </Navigation.Tile>
    <Navigation.Tile
      href="/admin/posts"
      label="Posts"
      selected={$page.url.pathname.startsWith('/admin/posts')}
    >
      <span><i class="fa-solid fa-newspaper fa-xl"></i></span>
    </Navigation.Tile>
    <Navigation.Tile
      href="/admin/events"
      label="Events"
      selected={$page.url.pathname.startsWith('/admin/events')}
    >
      <span><i class="fa-solid fa-calendar fa-xl"></i></span>
    </Navigation.Tile>
    <Navigation.Tile
      href="/admin/form-builder"
      label="Forms"
      selected={$page.url.pathname.startsWith('/admin/form-builder')}
    >
      <span><i class="fa-solid fa-hammer fa-xl"></i></span>
    </Navigation.Tile>
    <Navigation.Tile
      href="/admin/files"
      label="Files"
      selected={$page.url.pathname.startsWith('/admin/files')}
    >
      <span><i class="fa-solid fa-file-arrow-up fa-xl"></i></span>
    </Navigation.Tile>
  {/snippet}

  {#snippet footer()}
    <Navigation.Tile
      href="/settings"
      label="Settings"
      selected={$page.url.pathname.includes('/settings')}
    >
      <span><i class="fa-solid fa-gear fa-xl"></i></span>
    </Navigation.Tile>
  {/snippet}
</Navigation.Rail>
