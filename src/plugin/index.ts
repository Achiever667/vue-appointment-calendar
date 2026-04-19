// src/plugin/index.ts
import type { App } from 'vue'
import Calendar from '../components/Calendar.vue'

export default {
  install(app: App) {
    app.component('AppointmentCalendar', Calendar)
  }
}