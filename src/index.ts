import Calendar from './components/Calendar.vue'
import MonthView from './components/MonthView.vue'
import WeekView from './components/WeekView.vue'
import DayView from './components/DayView.vue'
import TimeSlots from './components/TimeSlots.vue'
import AppointmentItem from './components/AppointmentItem.vue'
import plugin from './plugin'

export {
  Calendar,
  Calendar as AppointmentCalendar,
  MonthView,
  WeekView,
  DayView,
  TimeSlots,
  AppointmentItem,
  plugin
}
export * from './types'
export * from './composables'
export * from './utils'

export default plugin
