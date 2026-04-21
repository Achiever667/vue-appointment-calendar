import type { Appointment, CalendarApiConfig } from '../types'
import { createApiClient } from './client'

type AppointmentPayload = Omit<Appointment, 'start' | 'end'> & {
  start: string | Date
  end: string | Date
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

export function createAppointmentService(config: CalendarApiConfig) {
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
