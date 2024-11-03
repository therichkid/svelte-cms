<script lang="ts">
	import Calendar from '@event-calendar/core';
	import DayGrid from '@event-calendar/day-grid';
	import Interaction from '@event-calendar/interaction';
	import List from '@event-calendar/list';
	import ResourceTimeline from '@event-calendar/resource-timeline';
	import TimeGrid from '@event-calendar/time-grid';

	const plugins = [DayGrid, TimeGrid, List, ResourceTimeline, Interaction];
	const options: Calendar.Options = {
		events: [],
		firstDay: 1,
		headerToolbar: {
			start: 'prev,next today',
			center: 'title',
			end: 'dayGridMonth,timeGridWeek,listMonth,resourceTimelineWeek,resourceTimelineMonth',
		},
		slotMinTime: '06:00:00',
		slotMaxTime: '22:00:00',
		view: 'dayGridMonth',
	};
</script>

<Calendar {plugins} {options} />
