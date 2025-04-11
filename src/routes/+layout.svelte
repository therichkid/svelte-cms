<script lang="ts">
  import SideDrawer from '$components/SideDrawer.svelte';
  import TopBar from '$components/TopBar.svelte';
  import '$utils/faLibrary';
  import type { Snippet } from 'svelte';
  import '../app.css';
  import type { LayoutServerData } from './$types';

  let { children, data }: { children: Snippet; data: LayoutServerData } = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr]">
  <header class="bg-blue-500">
    <TopBar user={data.user} />
  </header>

  <div class="grid grid-cols-[auto_1fr] overflow-hidden">
    <SideDrawer></SideDrawer>

    <div class="overflow-scroll p-5">
      {@render children()}
    </div>
  </div>
</div>
