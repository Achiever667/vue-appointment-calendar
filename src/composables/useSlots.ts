// src/composables/useSlots.ts
import { computed } from 'vue'
import type { Appointment, TimeSlot } from '../types'
import { getTimeSlots, isSameDay, addMinutes } from '../utils/date'

export function useSlots(
  appointments: Appointment[],
  startHour: number,
  endHour: number,
  slotDuration: number,
  date: Date
) {
  const daySlots = computed(() => {
    const slots = getTimeSlots(startHour, endHour, slotDuration)
    return slots.map(startTime => {
      const slotStart = new Date(date)
      slotStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0)
      const slotEnd = addMinutes(slotStart, slotDuration)

      const conflictingAppointments = appointments.filter(app =>
        isSameDay(app.start, date) &&
        app.start < slotEnd &&
        app.end > slotStart
      )

      return {
        start: slotStart,
        end: slotEnd,
        available: conflictingAppointments.length === 0,
        appointments: conflictingAppointments
      } as TimeSlot & { appointments: Appointment[] }
    })
  })

  const isSlotAvailable = (start: Date, end: Date): boolean => {
    return !appointments.some(app =>
      app.start < end && app.end > start
    )
  }

  const getAvailableSlots = (): TimeSlot[] => {
    return daySlots.value.filter(slot => slot.available)
  }

  const getOccupiedSlots = (): (TimeSlot & { appointments: Appointment[] })[] => {
    return daySlots.value.filter(slot => !slot.available)
  }

  return {
    daySlots,
    isSlotAvailable,
    getAvailableSlots,
    getOccupiedSlots
  }
}