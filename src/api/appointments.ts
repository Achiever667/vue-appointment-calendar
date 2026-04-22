import type { Appointment, AppointmentRepository, CalendarApiConfig } from '../types'
import { createApiClient } from './client'

type AppointmentPayload = Omit<Appointment, 'start' | 'end'> & {
  start: string | Date
  end: string | Date
}

const cloneAppointment = (appointment: Appointment): Appointment => ({
  ...appointment,
  start: new Date(appointment.start),
  end: new Date(appointment.end)
})

const cloneAppointments = (appointments: Appointment[]): Appointment[] => {
  return appointments.map((appointment) => cloneAppointment(appointment))
}

const normalizeAppointment = (appointment: AppointmentPayload): Appointment => {
  return {
    ...appointment,
    start: appointment.start instanceof Date ? appointment.start : new Date(appointment.start),
    end: appointment.end instanceof Date ? appointment.end : new Date(appointment.end)
  }
}

const normalizeAppointments = (appointments: AppointmentPayload[]): Appointment[] => {
  return appointments.map((appointment) => normalizeAppointment(appointment))
}

export function createApiAppointmentRepository(config: CalendarApiConfig): AppointmentRepository {
  const client = config.client ?? createApiClient(config.baseURL ?? '')

  return {
    async getAll(): Promise<Appointment[]> {
      const { data } = await client.get<AppointmentPayload[]>(config.endpoints.list)
      return normalizeAppointments(data)
    },
    async getById(id: string): Promise<Appointment> {
      const { data } = await client.get<AppointmentPayload>(config.endpoints.get(id))
      return normalizeAppointment(data)
    },
    async create(data: Appointment): Promise<Appointment> {
      const { data: created } = await client.post<AppointmentPayload>(config.endpoints.create, data)
      return normalizeAppointment(created)
    },
    async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
      const { data: updated } = await client.put<AppointmentPayload>(config.endpoints.update(id), data)
      return normalizeAppointment(updated)
    },
    async remove(id: string): Promise<void> {
      await client.delete(config.endpoints.delete(id))
    }
  }
}

export function createInMemoryAppointmentRepository(
  initialAppointments: Appointment[] = []
): AppointmentRepository {
  let appointments = cloneAppointments(initialAppointments)

  return {
    async getAll(): Promise<Appointment[]> {
      return cloneAppointments(appointments)
    },
    async getById(id: string): Promise<Appointment> {
      const appointment = appointments.find((item) => item.id === id)
      if (!appointment) {
        throw new Error(`Appointment with id "${id}" was not found.`)
      }

      return cloneAppointment(appointment)
    },
    async create(appointment: Appointment): Promise<Appointment> {
      const created = cloneAppointment(appointment)
      appointments = [...appointments, created]
      return cloneAppointment(created)
    },
    async update(id: string, updates: Partial<Appointment>): Promise<Appointment> {
      const index = appointments.findIndex((item) => item.id === id)
      if (index === -1) {
        throw new Error(`Appointment with id "${id}" was not found.`)
      }

      const updated = {
        ...appointments[index],
        ...updates
      }

      appointments = appointments.map((item, itemIndex) => itemIndex === index ? cloneAppointment(updated) : item)
      return cloneAppointment(updated)
    },
    async remove(id: string): Promise<void> {
      appointments = appointments.filter((item) => item.id !== id)
    }
  }
}

export function createAppointmentService(config: CalendarApiConfig): AppointmentRepository {
  return createApiAppointmentRepository(config)
}
