import { ref, computed, onMounted } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  Appointment,
  AppointmentRepository,
  CalendarApiConfig,
  UseAppointmentsOptions
} from '../types'
import {
  createApiAppointmentRepository,
  createInMemoryAppointmentRepository
} from '../api/appointments'
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

const isCalendarApiConfig = (
  value: Appointment[] | CalendarApiConfig | UseAppointmentsOptions | undefined
): value is CalendarApiConfig => {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'endpoints' in value
}

const isUseAppointmentsOptions = (
  value: Appointment[] | CalendarApiConfig | UseAppointmentsOptions | undefined
): value is UseAppointmentsOptions => {
  return typeof value === 'object' && value !== null && !Array.isArray(value) &&
    ('repository' in value || 'initialAppointments' in value || 'autoFetch' in value)
}

const resolveRepository = (
  initialAppointments: Appointment[],
  repository?: AppointmentRepository,
  apiConfig?: CalendarApiConfig
): AppointmentRepository => {
  if (repository) {
    return repository
  }

  if (apiConfig) {
    return createApiAppointmentRepository(apiConfig)
  }

  return createInMemoryAppointmentRepository(initialAppointments)
}

export function useAppointments(apiConfig?: CalendarApiConfig): UseAppointmentsResult
export function useAppointments(initialAppointments?: Appointment[], apiConfig?: CalendarApiConfig): UseAppointmentsResult
export function useAppointments(options?: UseAppointmentsOptions): UseAppointmentsResult
export function useAppointments(
  initialAppointmentsOrOptionsOrApiConfig: Appointment[] | CalendarApiConfig | UseAppointmentsOptions = [],
  apiConfig?: CalendarApiConfig
): UseAppointmentsResult {
  const options = isUseAppointmentsOptions(initialAppointmentsOrOptionsOrApiConfig)
    ? initialAppointmentsOrOptionsOrApiConfig
    : undefined
  let initialAppointments: Appointment[] = options?.initialAppointments ?? []
  let resolvedApiConfig = apiConfig

  if (isCalendarApiConfig(initialAppointmentsOrOptionsOrApiConfig)) {
    resolvedApiConfig = initialAppointmentsOrOptionsOrApiConfig
  } else if (Array.isArray(initialAppointmentsOrOptionsOrApiConfig)) {
    initialAppointments = initialAppointmentsOrOptionsOrApiConfig
  }

  const repository = resolveRepository(initialAppointments, options?.repository, resolvedApiConfig)
  const shouldAutoFetch = options?.autoFetch ?? Boolean(options?.repository || resolvedApiConfig)
  const appointments: Ref<Appointment[]> = ref([...initialAppointments])

  const fetchAppointments = async (): Promise<Appointment[]> => {
    const fetchedAppointments = await repository.getAll()
    appointments.value = fetchedAppointments
    return fetchedAppointments
  }

  const addAppointment = async (appointment: Appointment, allowOverlap: boolean = false): Promise<boolean> => {
    if (!canAddAppointment(appointment, appointments.value, allowOverlap)) {
      return false
    }

    const createdAppointment = await repository.create(appointment)
    appointments.value.push(createdAppointment)
    return true
  }

  const updateAppointment = async (
    id: string,
    updates: Partial<Appointment>,
    allowOverlap: boolean = false
  ): Promise<boolean> => {
    const index = appointments.value.findIndex((app) => app.id === id)
    if (index === -1) return false

    const updatedAppointment = { ...appointments.value[index], ...updates }
    const otherAppointments = appointments.value.filter((app) => app.id !== id)

    if (!canAddAppointment(updatedAppointment, otherAppointments, allowOverlap)) {
      return false
    }

    const persistedAppointment = await repository.update(id, updatedAppointment)
    appointments.value[index] = persistedAppointment
    return true
  }

  const removeAppointment = async (id: string): Promise<boolean> => {
    const index = appointments.value.findIndex((app) => app.id === id)
    if (index === -1) return false

    await repository.remove(id)
    appointments.value.splice(index, 1)
    return true
  }

  const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
    const localAppointment = appointments.value.find((app) => app.id === id)
    if (localAppointment) {
      return localAppointment
    }

    try {
      const fetchedAppointment = await repository.getById(id)
      if (!appointments.value.some((app) => app.id === fetchedAppointment.id)) {
        appointments.value.push(fetchedAppointment)
      }

      return fetchedAppointment
    } catch {
      return undefined
    }
  }

  const getAppointmentsForDate = (date: Date): Appointment[] => {
    return appointments.value.filter((app) => isSameDay(app.start, date))
  }

  const getAppointmentsInRange = (start: Date, end: Date): Appointment[] => {
    return appointments.value.filter((app) => app.start < end && app.end > start)
  }

  const getConflicting = (appointment: Appointment): Appointment[] => {
    return getConflictingAppointments(appointment, appointments.value)
  }

  const clearAppointments = () => {
    appointments.value = []
  }

  onMounted(() => {
    if (shouldAutoFetch) {
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
