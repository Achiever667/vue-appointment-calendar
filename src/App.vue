<script setup lang="ts">
import Calendar from './components/Calendar.vue'
import type { Appointment, CalendarConfig } from './types'

// Sample appointments data
const appointments: Appointment[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2024, 3, 18, 10, 0),
    end: new Date(2024, 3, 18, 11, 0),
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Doctor Appointment',
    start: new Date(2024, 3, 19, 14, 30),
    end: new Date(2024, 3, 19, 15, 30),
    color: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Project Review',
    start: new Date(2024, 3, 20, 9, 0),
    end: new Date(2024, 3, 20, 10, 30),
    color: 'bg-purple-500'
  }
]

const config: CalendarConfig = {
  view: 'month',
  slotDuration: 30,
  startHour: 8,
  endHour: 17,
  allowOverlap: false
}

const handleCalendarEvent = (event: any) => {
  console.log('Calendar event:', event)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        Vue Appointment Calendar Demo
      </h1>

      <Calendar
        :appointments="appointments"
        :config="config"
        @event="handleCalendarEvent"
      />
    </div>
  </div>
</template>
