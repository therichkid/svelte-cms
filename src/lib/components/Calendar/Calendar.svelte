<script lang="ts">
	import type { CalendarView } from '$lib/models/calendar';
	import MonthView from './MonthView.svelte';

	let { view }: { view: CalendarView } = $props();
</script>

{#if view === 'month'}
	<MonthView />
{/if}
