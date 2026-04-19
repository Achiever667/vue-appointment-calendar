// src/composables/useCalendar.ts
import { ref, computed, watch } from 'vue'
import type { CalendarConfig, ViewMode, CalendarEvent } from '../types'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  getDaysInMonth,
  getWeekDays,
  getHoursInDay,
  getTimeSlots
} from '../utils/date'

export function useCalendar(config: CalendarConfig = {}) {
  const currentDate = ref(config.date || new Date())
  const view = ref<ViewMode>(config.view || 'month')
  const slotDuration = ref(config.slotDuration || 30)
  const startHour = ref(config.startHour || 8)
  const endHour = ref(config.endHour || 17)
  const allowOverlap = ref(config.allowOverlap || false)
  const locale = ref(config.locale || 'en-US')
  const timeZone = ref(config.timeZone || 'UTC')

  const currentViewDates = computed(() => {
    switch (view.value) {
      case 'month':
        return getDaysInMonth(currentDate.value)
      case 'week':
        return getWeekDays(currentDate.value)
      case 'day':
        return [currentDate.value]
      default:
        return []
    }
  })

  const hours = computed(() => getHoursInDay(startHour.value, endHour.value))

  const timeSlots = computed(() => getTimeSlots(startHour.value, endHour.value, slotDuration.value))

  const navigateToDate = (date: Date) => {
    currentDate.value = date
  }

  const navigateToNext = () => {
    switch (view.value) {
      case 'month':
        currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
        break
      case 'week':
        currentDate.value = addDays(currentDate.value, 7)
        break
      case 'day':
        currentDate.value = addDays(currentDate.value, 1)
        break
    }
  }

  const navigateToPrevious = () => {
    switch (view.value) {
      case 'month':
        currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
        break
      case 'week':
        currentDate.value = addDays(currentDate.value, -7)
        break
      case 'day':
        currentDate.value = addDays(currentDate.value, -1)
        break
    }
  }

  const navigateToToday = () => {
    currentDate.value = new Date()
  }

  const setView = (newView: ViewMode) => {
    view.value = newView
  }

  return {
    currentDate,
    view,
    slotDuration,
    startHour,
    endHour,
    allowOverlap,
    locale,
    timeZone,
    currentViewDates,
    hours,
    timeSlots,
    navigateToDate,
    navigateToNext,
    navigateToPrevious,
    navigateToToday,
    setView
  }
}