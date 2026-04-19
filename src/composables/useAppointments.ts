// src/composables/useAppointments.ts
import { ref, computed } from 'vue'
import type { Appointment } from '../types'
import { canAddAppointment, getConflictingAppointments } from '../utils/conflict'
import { isSameDay } from '../utils/date'

export function useAppointments(initialAppointments: Appointment[] = []) {
  const appointments = ref<Appointment[]>(initialAppointments)

  const addAppointment = (appointment: Appointment, allowOverlap: boolean = false): boolean => {
    if (!canAddAppointment(appointment, appointments.value, allowOverlap)) {
      return false
    }
    appointments.value.push(appointment)
    return true
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>, allowOverlap: boolean = false): boolean => {
    const index = appointments.value.findIndex(app => app.id === id)
    if (index === -1) return false

    const updatedAppointment = { ...appointments.value[index], ...updates }
    if (!canAddAppointment(updatedAppointment, appointments.value, allowOverlap)) {
      return false
    }

    appointments.value[index] = updatedAppointment
    return true
  }

  const removeAppointment = (id: string): boolean => {
    const index = appointments.value.findIndex(app => app.id === id)
    if (index === -1) return false
    appointments.value.splice(index, 1)
    return true
  }

  const getAppointmentById = (id: string): Appointment | undefined => {
    return appointments.value.find(app => app.id === id)
  }

  const getAppointmentsForDate = (date: Date): Appointment[] => {
    return appointments.value.filter(app => isSameDay(app.start, date))
  }

  const getAppointmentsInRange = (start: Date, end: Date): Appointment[] => {
    return appointments.value.filter(app =>
      app.start < end && app.end > start
    )
  }

  const getConflicting = (appointment: Appointment): Appointment[] => {
    return getConflictingAppointments(appointment, appointments.value)
  }

  const clearAppointments = () => {
    appointments.value = []
  }

  return {
    appointments: computed(() => appointments.value),
    addAppointment,
    updateAppointment,
    removeAppointment,
    getAppointmentById,
    getAppointmentsForDate,
    getAppointmentsInRange,
    getConflicting,
    clearAppointments
  }
}