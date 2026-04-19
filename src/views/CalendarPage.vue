<!-- src/views/CalendarPage.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import Calendar from '../components/Calendar.vue'
import type { Appointment, CalendarConfig, CalendarEvent } from '../types'

const appointments = ref<Appointment[]>([
  {
    id: '1',
    title: 'Team Standup',
    start: new Date(2024, 3, 18, 9, 0),
    end: new Date(2024, 3, 18, 9, 30),
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Client Meeting',
    start: new Date(2024, 3, 18, 14, 0),
    end: new Date(2024, 3, 18, 15, 0),
    color: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Project Planning',
    start: new Date(2024, 3, 19, 10, 0),
    end: new Date(2024, 3, 19, 12, 0),
    color: 'bg-purple-500'
  },
  {
    id: '4',
    title: 'Code Review',
    start: new Date(2024, 3, 20, 16, 0),
    end: new Date(2024, 3, 20, 17, 0),
    color: 'bg-orange-500'
  }
])

const config = ref<CalendarConfig>({
  view: 'month',
  slotDuration: 30,
  startHour: 8,
  endHour: 18,
  allowOverlap: false
})

const handleEvent = (event: CalendarEvent) => {
  console.log('Calendar event:', event)

  if (event.type === 'slot-click') {
    // Handle slot click - could open appointment creation modal
    const slot = event.payload
    console.log('Clicked slot:', slot.start.toLocaleString(), 'to', slot.end.toLocaleString())
  } else if (event.type === 'appointment-click') {
    // Handle appointment click - could open appointment details modal
    const appointment = event.payload
    console.log('Clicked appointment:', appointment.title)
  }
}
</script>

<template>
  <div class="calendar-page p-6 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Appointment Calendar</h1>
      <p class="text-gray-600">Manage your appointments and schedule</p>
    </div>

    <Calendar
      :appointments="appointments"
      :config="config"
      @event="handleEvent"
    />
  </div>
</template>