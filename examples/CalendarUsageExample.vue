<script setup lang="ts">
import { ref } from 'vue'
import AppointmentCalendar from '../src/components/Calendar.vue'
import { createApiAppointmentRepository } from '../src/api'
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

const appointmentRepository = createApiAppointmentRepository(apiConfig)
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
          Inject a repository so the calendar depends on an abstraction instead of a concrete API config.
        </p>
      </div>

      <AppointmentCalendar
        :config="calendarConfig"
        :repository="appointmentRepository"
      />
    </section>

    <section class="space-y-4">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Custom UI With Scoped Slots</h2>
        <p class="text-sm text-slate-600">
          Replace the header, appointment card, and week cells while keeping the calendar logic intact.
        </p>
      </div>

      <AppointmentCalendar
        :appointments="localAppointments"
        :config="calendarConfig"
      >
        <template #header="{ currentDate, navigateToPrevious, navigateToNext, navigateToToday, view, viewOptions, setView }">
          <div class="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Custom Header</p>
                <h3 class="mt-2 text-2xl font-semibold">
                  {{ currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}
                </h3>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="rounded-full bg-white/10 px-3 py-2 text-sm" @click="navigateToPrevious()">Prev</button>
                <button type="button" class="rounded-full bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950" @click="navigateToToday()">Today</button>
                <button type="button" class="rounded-full bg-white/10 px-3 py-2 text-sm" @click="navigateToNext()">Next</button>
                <button
                  v-for="option in viewOptions"
                  :key="option"
                  type="button"
                  class="rounded-full px-3 py-2 text-sm capitalize"
                  :class="view === option ? 'bg-white text-slate-900' : 'bg-white/10 text-white'"
                  @click="setView(option)"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>
        </template>

        <template #week-cell="{ slotStart }">
          <div class="h-full bg-gradient-to-br from-white via-white to-slate-50"></div>
          <div
            v-if="slotStart.getMinutes() === 0"
            class="pointer-events-none absolute inset-x-2 top-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300"
          >
            {{ slotStart.getHours() }}:00
          </div>
        </template>

        <template #appointment="{ appointment, selectAppointment }">
          <button
            type="button"
            class="flex h-full w-full flex-col justify-between rounded-2xl border border-white/30 bg-slate-950/85 p-2 text-left text-white shadow-lg backdrop-blur"
            @click.stop="selectAppointment(appointment)"
          >
            <span class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              {{ appointment.location || 'No location' }}
            </span>
            <span class="mt-1 line-clamp-2 text-sm font-semibold">{{ appointment.title }}</span>
            <span class="mt-2 text-[11px] text-slate-300">
              {{ appointment.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              -
              {{ appointment.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </button>
        </template>
      </AppointmentCalendar>
    </section>
  </div>
</template>
