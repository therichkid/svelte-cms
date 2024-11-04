<script lang="ts">
	import Calendar from '$components/Calendar/Calendar.svelte';
	import { CalendarView } from '$lib/models/calendar';
</script>

<Calendar view={CalendarView.Month} />
