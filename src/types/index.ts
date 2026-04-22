// src/types/index.ts
import type { AxiosInstance } from 'axios'

export interface User {
  id: string
  name: string
  avatar?: string
  initials?: string
  email?: string
}

export interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  resourceId?: string
  color?: string
  description?: string
  user?: User
  attendees?: User[]
  location?: string
  notes?: string
}

export interface AppointmentRepository {
  getAll(): Promise<Appointment[]>
  getById(id: string): Promise<Appointment>
  create(appointment: Appointment): Promise<Appointment>
  update(id: string, appointment: Partial<Appointment>): Promise<Appointment>
  remove(id: string): Promise<void>
}

export interface CalendarApiEndpoints {
  list: string
  get: (id: string) => string
  create: string
  update: (id: string) => string
  delete: (id: string) => string
}

export interface CalendarApiConfig {
  baseURL?: string
  client?: AxiosInstance
  endpoints: CalendarApiEndpoints
}

export interface CalendarConfig {
  view?: 'day' | 'week' | 'month'
  slotDuration?: number // minutes
  startHour?: number
  endHour?: number
  allowOverlap?: boolean
  date?: Date
  locale?: string
  timeZone?: string
}

export interface TimeSlot {
  start: Date
  end: Date
  available: boolean
}

export type ViewMode = 'day' | 'week' | 'month'

export interface UseAppointmentsOptions {
  initialAppointments?: Appointment[]
  repository?: AppointmentRepository
  autoFetch?: boolean
}

export type CalendarEvent =
  | { type: 'appointment-click'; payload: Appointment }
  | { type: 'slot-click'; payload: { start: Date; end: Date } }
  | { type: 'date-change'; payload: { date: Date } }
  | { type: 'view-change'; payload: { view: ViewMode } }
  | { type: 'appointment-added'; payload: Appointment }
  | { type: 'appointment-updated'; payload: Appointment }
  | { type: 'appointment-removed'; payload: { id: string } }
