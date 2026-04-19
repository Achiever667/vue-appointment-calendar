# Vue Appointment Calendar

A customizable, modular Vue 3 appointment calendar component built with TypeScript, Vite, and Tailwind CSS. Perfect for scheduling applications, booking systems, and any project that needs calendar functionality.

## ✨ Features

- 📅 **Multiple Views**: Month, Week, and Day views
- 🎨 **Customizable Styling**: Built with Tailwind CSS for easy customization
- 🔧 **Modular Architecture**: Separate logic (composables) from UI (components)
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🏗️ **TypeScript Support**: Full type safety with comprehensive TypeScript definitions
- 🎯 **Event Handling**: Rich event system for appointments and user interactions
- ⚡ **Performance Optimized**: Efficient rendering and state management
- 🔄 **Conflict Detection**: Built-in appointment conflict detection
- 🎭 **Plugin Support**: Easy integration via Vue plugin

## 🚀 Installation

### Via npm
```bash
npm install vue-appointment-calendar
```

### Via yarn
```bash
yarn add vue-appointment-calendar
```

### Via pnpm
```bash
pnpm add vue-appointment-calendar
```

## 📖 Usage

### Basic Setup

```vue
<template>
  <AppointmentCalendar
    :appointments="appointments"
    :config="calendarConfig"
    @event="handleCalendarEvent"
  />
</template>

<script setup lang="ts">
import { AppointmentCalendar } from 'vue-appointment-calendar'
import type { Appointment, CalendarConfig, CalendarEvent } from 'vue-appointment-calendar'

const appointments = ref<Appointment[]>([
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2024, 3, 18, 10, 0),
    end: new Date(2024, 3, 18, 11, 0),
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
  console.log('Calendar event:', event)
}
</script>
```

### Vue Plugin Setup

```ts
import { createApp } from 'vue'
import App from './App.vue'
import VueAppointmentCalendar from 'vue-appointment-calendar'

const app = createApp(App)
app.use(VueAppointmentCalendar)
app.mount('#app')
```

Then use the global component:

```vue
<template>
  <AppointmentCalendar
    :appointments="appointments"
    :config="config"
  />
</template>
```

## 📚 API Reference

### Props

#### `appointments`
- **Type**: `Appointment[]`
- **Required**: No
- **Default**: `[]`
- **Description**: Array of appointment objects to display on the calendar

#### `config`
- **Type**: `CalendarConfig`
- **Required**: No
- **Default**: See below
- **Description**: Configuration object for calendar behavior

### CalendarConfig

```ts
interface CalendarConfig {
  view?: 'day' | 'week' | 'month' // Default: 'month'
  slotDuration?: number // Minutes, default: 30
  startHour?: number // Default: 8
  endHour?: number // Default: 17
  allowOverlap?: boolean // Default: false
  date?: Date // Default: new Date()
  locale?: string // Default: 'en-US'
  timeZone?: string // Default: 'UTC'
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
}
```

### Events

#### `@event`
- **Payload**: `CalendarEvent`
- **Description**: Emitted for various calendar interactions

```ts
interface CalendarEvent {
  type: 'appointment-click' | 'slot-click' | 'date-change' | 'view-change'
  payload: any
}
```

## 🎨 Customization

### Custom Styling

The calendar uses Tailwind CSS classes, making it easy to customize:

```vue
<template>
  <AppointmentCalendar
    class="custom-calendar"
    :appointments="appointments"
  />
</template>

<style scoped>
.custom-calendar {
  /* Your custom styles */
}
</style>
```

### Custom Appointment Colors

```ts
const appointments = [
  {
    id: '1',
    title: 'Meeting',
    start: new Date(),
    end: new Date(),
    color: 'bg-red-500' // Tailwind color class
  }
]
```

## 🛠️ Composables

The library provides composables for advanced usage:

### `useCalendar`

```ts
import { useCalendar } from 'vue-appointment-calendar'

const { currentDate, view, navigateToNext, navigateToPrevious, setView } = useCalendar(config)
```

### `useAppointments`

```ts
import { useAppointments } from 'vue-appointment-calendar'

const { appointments, addAppointment, updateAppointment, removeAppointment } = useAppointments(initialAppointments)
```

### `useSlots`

```ts
import { useSlots } from 'vue-appointment-calendar'

const { daySlots, isSlotAvailable } = useSlots(appointments, startHour, endHour, slotDuration, date)
```

## 🏗️ Architecture

The library follows a modular architecture:

```
src/
├── components/     # UI components
│   ├── Calendar.vue
│   ├── MonthView.vue
│   ├── WeekView.vue
│   ├── DayView.vue
│   └── TimeSlots.vue
├── composables/    # Business logic
│   ├── useCalendar.ts
│   ├── useAppointments.ts
│   └── useSlots.ts
├── types/         # TypeScript definitions
├── utils/         # Helper functions
│   ├── date.ts
│   └── conflict.ts
└── plugin/        # Vue plugin
```

## 🔧 Development

### Prerequisites

- Node.js 16+
- npm, yarn, or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/vue-appointment-calendar.git
cd vue-appointment-calendar

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vue 3](https://vuejs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Bundled with [Vite](https://vitejs.dev/)
- TypeScript support via [Vue TypeScript](https://vuejs.org/guide/typescript/overview.html)

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
