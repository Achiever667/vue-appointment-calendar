import type { Appointment } from '../types'

export function hasConflict(a: Appointment, b: Appointment): boolean {
  return (
    a.id !== b.id &&
    a.start < b.end &&
    a.end > b.start &&
    (!a.resourceId || !b.resourceId || a.resourceId === b.resourceId)
  )
}

export function getConflictingAppointments(appointment: Appointment, appointments: Appointment[]): Appointment[] {
  return appointments.filter((existing) => hasConflict(appointment, existing))
}

export function canAddAppointment(appointment: Appointment, appointments: Appointment[], allowOverlap: boolean = false): boolean {
  if (allowOverlap) return true
  return !appointments.some((existing) => hasConflict(appointment, existing))
}
