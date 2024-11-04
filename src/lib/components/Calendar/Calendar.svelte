<script lang="ts">
	import type { CalendarView } from '$lib/models/calendar';
	import type { Event } from '$lib/models/event';
	import MonthView from './MonthView.svelte';

	let { view, events = $bindable() }: { view: CalendarView; events: Event[] } = $props();
</script>

{#if view === 'month'}
	<MonthView {events} />
{/if}
