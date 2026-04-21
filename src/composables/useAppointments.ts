// src/composables/useAppointments.ts
import { ref, computed, onMounted } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { Appointment, CalendarApiConfig } from '../types'
import { createAppointmentService } from '../api/appointments'
import { canAddAppointment, getConflictingAppointments } from '../utils/conflict'
import { isSameDay } from '../utils/date'

interface UseAppointmentsResult {
  appointments: ComputedRef<Appointment[]>
  fetchAppointments: () => Promise<Appointment[]>
  addAppointment: (appointment: Appointment, allowOverlap?: boolean) => Promise<boolean>
  updateAppointment: (id: string, updates: Partial<Appointment>, allowOverlap?: boolean) => Promise<boolean>
  removeAppointment: (id: string) => Promise<boolean>
  getAppointmentById: (id: string) => Promise<Appointment | undefined>
  getAppointmentsForDate: (date: Date) => Appointment[]
  getAppointmentsInRange: (start: Date, end: Date) => Appointment[]
  getConflicting: (appointment: Appointment) => Appointment[]
  clearAppointments: () => void
}

const isCalendarApiConfig = (value: Appointment[] | CalendarApiConfig | undefined): value is CalendarApiConfig => {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'endpoints' in value
}

export function useAppointments(apiConfig?: CalendarApiConfig): UseAppointmentsResult
export function useAppointments(initialAppointments?: Appointment[], apiConfig?: CalendarApiConfig): UseAppointmentsResult
export function useAppointments(
  initialAppointmentsOrApiConfig: Appointment[] | CalendarApiConfig = [],
  apiConfig?: CalendarApiConfig
): UseAppointmentsResult {
  const initialAppointments = isCalendarApiConfig(initialAppointmentsOrApiConfig) ? [] : initialAppointmentsOrApiConfig
  const resolvedApiConfig = isCalendarApiConfig(initialAppointmentsOrApiConfig) ? initialAppointmentsOrApiConfig : apiConfig
  const appointments: Ref<Appointment[]> = ref([...initialAppointments])
  const appointmentService = resolvedApiConfig ? createAppointmentService(resolvedApiConfig) : null

  const fetchAppointments = async (): Promise<Appointment[]> => {
    if (!appointmentService) {
      return appointments.value
    }

    const fetchedAppointments = await appointmentService.getAll()
    appointments.value = fetchedAppointments
    return fetchedAppointments
  }

  const addAppointment = async (appointment: Appointment, allowOverlap: boolean = false): Promise<boolean> => {
    if (!canAddAppointment(appointment, appointments.value, allowOverlap)) {
      return false
    }

    if (appointmentService) {
      const createdAppointment = await appointmentService.create(appointment)
      appointments.value.push(createdAppointment)
      return true
    }

    appointments.value.push(appointment)
    return true
  }

  const updateAppointment = async (
    id: string,
    updates: Partial<Appointment>,
    allowOverlap: boolean = false
  ): Promise<boolean> => {
    const index = appointments.value.findIndex(app => app.id === id)
    if (index === -1) return false

    const updatedAppointment = { ...appointments.value[index], ...updates }
    const otherAppointments = appointments.value.filter((app) => app.id !== id)

    if (!canAddAppointment(updatedAppointment, otherAppointments, allowOverlap)) {
      return false
    }

    if (appointmentService) {
      const persistedAppointment = await appointmentService.update(id, updatedAppointment)
      appointments.value[index] = persistedAppointment
      return true
    }

    appointments.value[index] = updatedAppointment
    return true
  }

  const removeAppointment = async (id: string): Promise<boolean> => {
    const index = appointments.value.findIndex(app => app.id === id)
    if (index === -1) return false

    if (appointmentService) {
      await appointmentService.remove(id)
    }

    appointments.value.splice(index, 1)
    return true
  }

  const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
    const localAppointment = appointments.value.find(app => app.id === id)
    if (!appointmentService || localAppointment) {
      return localAppointment
    }

    const fetchedAppointment = await appointmentService.getById(id)
    if (!appointments.value.some((app) => app.id === fetchedAppointment.id)) {
      appointments.value.push(fetchedAppointment)
    }

    return fetchedAppointment
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

  onMounted(() => {
    if (appointmentService) {
      void fetchAppointments()
    }
  })

  return {
    appointments: computed(() => appointments.value),
    fetchAppointments,
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
