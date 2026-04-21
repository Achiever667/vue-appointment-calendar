<script setup lang="ts">
import { ref } from 'vue'
import AppointmentCalendar from '../src/components/Calendar.vue'
import type { Appointment, CalendarApiConfig, CalendarConfig } from '../src/types'

const localAppointments = ref<Appointment[]>([
  {
    id: 'local-1',
    title: 'Design Review',
    start: new Date(2026, 3, 20, 10, 0),
    end: new Date(2026, 3, 20, 11, 0),
    color: 'bg-blue-500',
    location: 'Studio Room 2'
  },
  {
    id: 'local-2',
    title: 'Sprint Planning',
    start: new Date(2026, 3, 21, 14, 0),
    end: new Date(2026, 3, 21, 15, 30),
    color: 'bg-green-500',
    location: 'Conference Room A'
  }
])

const calendarConfig = ref<CalendarConfig>({
  view: 'week',
  date: new Date(2026, 3, 20),
  slotDuration: 30,
  startHour: 8,
  endHour: 18,
  allowOverlap: false
})

const apiConfig: CalendarApiConfig = {
  baseURL: 'https://jsonplaceholder.typicode.com',
  endpoints: {
    list: '/bookings',
    get: (id: string) => `/appointments/${id}`,
    create: '/appointments',
    update: (id: string) => `/appointments/${id}`,
    delete: (id: string) => `/appointments/${id}`
  }
}
</script>

<template>
  <div class="space-y-10 p-6">
    <section class="space-y-4">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Local State Usage</h2>
        <p class="text-sm text-slate-600">
          Use the calendar with in-memory appointments only. No API configuration is required.
        </p>
      </div>

      <AppointmentCalendar
        :appointments="localAppointments"
        :config="calendarConfig"
      />
    </section>

    <section class="space-y-4">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">API-Backed Usage</h2>
        <p class="text-sm text-slate-600">
          Pass <code>apiConfig</code> to load and persist appointments through your backend.
        </p>
      </div>

      <AppointmentCalendar
        :config="calendarConfig"
        :api-config="apiConfig"
      />
    </section>
  </div>
</template>
