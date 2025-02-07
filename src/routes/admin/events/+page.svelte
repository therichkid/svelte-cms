<script lang="ts">
  import Calendar from '$components/Calendar/Calendar.svelte';
  import { CalendarView } from '$lib/models/calendar';
  import type { Event } from '$lib/models/event';
  import { addDays, setHours, startOfToday } from 'date-fns';

  const today = startOfToday();
  const eventStart = setHours(today, 14);
  const eventEnd = setHours(today, 16);
  const eventTitles = ['Bouldering', 'Yoga', 'Crossfit', 'Running', 'Swimming'];

  let events = $state<Event[]>(
    Array.from({ length: 5 }, (_, i) => {
      const addOrSubtract = Math.random() < 0.5 ? -1 : 1;
      const daysFromToday = addOrSubtract * Math.floor(Math.random() * 5);

      return {
        id: i,
        title: eventTitles[i],
        start: addDays(eventStart, daysFromToday),
        end: addDays(eventEnd, daysFromToday),
      };
    }),
  );
</script>

<Calendar view={CalendarView.Month} bind:events />
