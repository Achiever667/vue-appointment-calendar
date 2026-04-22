# Vue Appointment Calendar

A customizable Vue 3 appointment calendar built with TypeScript, Vite, and Tailwind CSS.

It supports month, week, and day views, appointment CRUD flows, API-backed repositories, and scoped-slot UI customization.

## Features

- Month, week, and day views
- Composition API composables for reusable calendar logic
- Repository-based persistence abstraction
- TypeScript types for appointments, config, events, and repositories
- Slot-based UI customization for header, cells, and appointment rendering
- Conflict detection for overlapping appointments
- Vue plugin support

## Installation

```bash
npm install vue-appointment-calendar
```

## Basic Usage

```vue
<template>
  <AppointmentCalendar
    :appointments="appointments"
    :config="calendarConfig"
    @event="handleCalendarEvent"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppointmentCalendar } from 'vue-appointment-calendar'
import type { Appointment, CalendarConfig, CalendarEvent } from 'vue-appointment-calendar'

const appointments = ref<Appointment[]>([
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2026, 3, 18, 10, 0),
    end: new Date(2026, 3, 18, 11, 0),
    color: 'bg-blue-500'
  }
])

const calendarConfig: CalendarConfig = {
  view: 'month',
  slotDuration: 30,
  startHour: 8,
  endHour: 17,
  allowOverlap: false
}

const handleCalendarEvent = (event: CalendarEvent) => {
  console.log(event)
}
</script>
```

## Repository Usage

The calendar supports dependency injection through `AppointmentRepository`. This keeps the UI layer independent from HTTP details.

```vue
<script setup lang="ts">
import { AppointmentCalendar, createApiAppointmentRepository } from 'vue-appointment-calendar'
import type { CalendarApiConfig, CalendarConfig } from 'vue-appointment-calendar'

const config: CalendarConfig = {
  view: 'week',
  slotDuration: 30,
  startHour: 8,
  endHour: 18
}

const apiConfig: CalendarApiConfig = {
  baseURL: 'https://example.com/api',
  endpoints: {
    list: '/appointments',
    get: (id: string) => `/appointments/${id}`,
    create: '/appointments',
    update: (id: string) => `/appointments/${id}`,
    delete: (id: string) => `/appointments/${id}`
  }
}

const repository = createApiAppointmentRepository(apiConfig)
</script>

<template>
  <AppointmentCalendar
    :config="config"
    :repository="repository"
  />
</template>
```

`apiConfig` is still supported for backward compatibility, but `repository` is the cleaner pattern going forward.

## UI Customization

The calendar logic and UI are separated. You can keep the built-in behavior and replace the rendered UI with scoped slots.

### Example

```vue
<AppointmentCalendar :appointments="appointments" :config="config">
  <template #header="{ currentDate, navigateToPrevious, navigateToNext, navigateToToday, view, viewOptions, setView }">
    <div class="rounded-3xl bg-slate-900 p-5 text-white">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-2xl font-semibold">
          {{ currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}
        </h2>

        <div class="flex gap-2">
          <button type="button" @click="navigateToPrevious()">Prev</button>
          <button type="button" @click="navigateToToday()">Today</button>
          <button type="button" @click="navigateToNext()">Next</button>
          <button
            v-for="option in viewOptions"
            :key="option"
            type="button"
            @click="setView(option)"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </template>

  <template #week-cell="{ slotStart }">
    <div class="h-full bg-gradient-to-br from-white to-slate-50"></div>
    <div class="absolute left-2 top-2 text-[10px] text-slate-300">
      {{ slotStart.getHours() }}:00
    </div>
  </template>

  <template #appointment="{ appointment, selectAppointment }">
    <button
      type="button"
      class="w-full rounded-2xl bg-slate-900 p-2 text-left text-white"
      @click.stop="selectAppointment(appointment)"
    >
      <div class="text-xs uppercase text-emerald-300">
        {{ appointment.location || 'No location' }}
      </div>
      <div class="mt-1 font-semibold">{{ appointment.title }}</div>
    </button>
  </template>
</AppointmentCalendar>
```

### Available Slots

- `header`
- `appointment`
- `month-weekday`
- `month-day`
- `week-header-day`
- `week-time-label`
- `week-cell`
- `day-all-day-header`
- `day-slot`

## API Reference

### Props

#### `appointments`

- Type: `Appointment[]`
- Required: No
- Default: `[]`

#### `repository`

- Type: `AppointmentRepository`
- Required: No
- Default: `undefined`

#### `apiConfig`

- Type: `CalendarApiConfig`
- Required: No
- Default: `undefined`

#### `config`

- Type: `CalendarConfig`
- Required: No

#### `viewMode`

- Type: `'day' | 'week' | 'month'`
- Required: No

### CalendarConfig

```ts
interface CalendarConfig {
  view?: 'day' | 'week' | 'month'
  slotDuration?: number
  startHour?: number
  endHour?: number
  allowOverlap?: boolean
  date?: Date
  locale?: string
  timeZone?: string
}
```

### Appointment

```ts
interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  resourceId?: string
  color?: string
  description?: string
  user?: User
  attendees?: User[]
  location?: string
  notes?: string
}
```

### AppointmentRepository

```ts
interface AppointmentRepository {
  getAll(): Promise<Appointment[]>
  getById(id: string): Promise<Appointment>
  create(appointment: Appointment): Promise<Appointment>
  update(id: string, appointment: Partial<Appointment>): Promise<Appointment>
  remove(id: string): Promise<void>
}
```

### Events

```ts
type CalendarEvent =
  | { type: 'appointment-click'; payload: Appointment }
  | { type: 'slot-click'; payload: { start: Date; end: Date } }
  | { type: 'date-change'; payload: { date: Date } }
  | { type: 'view-change'; payload: { view: ViewMode } }
  | { type: 'appointment-added'; payload: Appointment }
  | { type: 'appointment-updated'; payload: Appointment }
  | { type: 'appointment-removed'; payload: { id: string } }
```

## Composables

### `useCalendar`

```ts
import { useCalendar } from 'vue-appointment-calendar'

const {
  currentDate,
  view,
  navigateToNext,
  navigateToPrevious,
  navigateToToday,
  setView
} = useCalendar(config)
```

### `useAppointments`

```ts
import { useAppointments } from 'vue-appointment-calendar'

const {
  appointments,
  fetchAppointments,
  addAppointment,
  updateAppointment,
  removeAppointment
} = useAppointments({
  initialAppointments,
  repository
})
```

### `useSlots`

```ts
import { useSlots } from 'vue-appointment-calendar'

const { daySlots, isSlotAvailable } = useSlots(appointments, startHour, endHour, slotDuration, date)
```

## Architecture

This project does not use the Saga pattern.

It follows a Vue Composition API + repository-based modular architecture with SOLID-inspired separation of concerns:

- Composition API: reusable behavior is split into composables such as `useCalendar`, `useAppointments`, and `useSlots`
- Repository pattern: persistence is abstracted behind `AppointmentRepository`
- Dependency inversion: the calendar can depend on an injected repository rather than a concrete API client
- Single responsibility: UI rendering, state handling, persistence, and utilities live in separate layers

### Structure

```text
src/
  components/   UI components and views
  composables/  calendar and appointment behavior
  api/          repository adapters and API client
  types/        shared TypeScript contracts
  utils/        date and conflict helpers
  plugin/       Vue plugin entry
```

## Plugin Usage

```ts
import { createApp } from 'vue'
import App from './App.vue'
import VueAppointmentCalendar from 'vue-appointment-calendar'

createApp(App).use(VueAppointmentCalendar).mount('#app')
```

## Development

```bash
npm install
npm run dev
npm run build
```

## License

MIT
