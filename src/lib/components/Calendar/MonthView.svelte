<script lang="ts">
	import type { Event } from '$lib/models/event';
	import {
		addMonths,
		eachDayOfInterval,
		endOfMonth,
		format,
		getDay,
		isSameDay,
		isToday,
		startOfMonth,
		startOfToday,
	} from 'date-fns';
	import { de } from 'date-fns/locale';

	let { events = $bindable() }: { events: Event[] } = $props();

	const daysOfWeek = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
	const today = startOfToday();

	let firstDayOfMonth = $state(startOfMonth(today));
	let lastDayOfMonth = $state(endOfMonth(today));
	let daysInMonth = $derived(eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth }));
	let displayedMonth = $derived(format(firstDayOfMonth, 'MMMM yyyy', { locale: de }));

	let selectedDay = $state<Date | null>(null);

	const colStartClasses = [
		'col-start-7',
		'',
		'col-start-2',
		'col-start-3',
		'col-start-4',
		'col-start-5',
		'col-start-6',
	];

	const prevMonth = () => {
		firstDayOfMonth = addMonths(firstDayOfMonth, -1);
		lastDayOfMonth = endOfMonth(firstDayOfMonth);
	};

	const nextMonth = () => {
		firstDayOfMonth = addMonths(firstDayOfMonth, 1);
		lastDayOfMonth = endOfMonth(firstDayOfMonth);
	};

	const getEventsForDay = (day: Date) => {
		return events?.filter((event) => isSameDay(event.start, day)) || [];
	};

	const getEventTime = (event: Event) => {
		return format(event.start, 'HH:mm') + '-' + format(event.end, 'HH:mm');
	};
</script>

<div
	onwheel={(event) => {
		event.preventDefault();
		if (event.deltaY < 0) prevMonth();
		if (event.deltaY > 0) nextMonth();
	}}
>
	<div class="my-4 flex items-center justify-between">
		<button onclick={() => prevMonth()} class="variant-soft btn-icon" aria-label="Previous Month">
			<span><i class="fa-solid fa-chevron-left"></i></span>
		</button>
		<h2 class="h4">{displayedMonth}</h2>
		<button onclick={() => nextMonth()} class="variant-soft btn-icon" aria-label="Next Month">
			<span><i class="fa-solid fa-chevron-right"></i></span>
		</button>
	</div>

	<div class="flex flex-col gap-4 rounded-lg border border-surface-700">
		<div class="grid grid-cols-7 py-2">
			{#each daysOfWeek as day}
				<div class="text-center text-gray-500">{day}</div>
			{/each}
		</div>

		<div class="grid flex-1 grid-cols-7">
			{#each daysInMonth as day, i}
				<div
					onclick={() => (selectedDay = day)}
					onkeydown={(event) => {
						if (event.key === 'Enter') selectedDay = day;
					}}
					class="{i === 0 &&
						colStartClasses[
							getDay(day)
						]} flex h-[120px] flex-col items-center justify-start gap-1 rounded-lg p-1 text-center hover:bg-surface-800"
					role="button"
					tabindex="0"
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full"
						class:variant-filled-primary={selectedDay === day}
						class:variant-ringed-primary={isToday(day) && selectedDay !== day}
					>
						{format(day, 'd')}
					</div>
					{#each getEventsForDay(day) as event (event.id)}
						<div
							class="card variant-filled-secondary flex w-full items-center justify-between px-2 py-1"
						>
							<span class="text-bold truncate text-sm">{event.title}</span>
							<span class="text-sm text-gray-300">{getEventTime(event)}</span>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
