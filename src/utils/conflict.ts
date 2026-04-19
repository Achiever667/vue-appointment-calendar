// src/utils/conflict.ts
import type { Appointment } from '../types'

export function hasConflict(appointment: Appointment, appointments: Appointment[]): boolean {
  return appointments.some(existing =>
    existing.id !== appointment.id &&
    existing.start < appointment.end &&
    existing.end > appointment.start &&
    (!existing.resourceId || !appointment.resourceId || existing.resourceId === appointment.resourceId)
  )
}

export function getConflictingAppointments(appointment: Appointment, appointments: Appointment[]): Appointment[] {
  return appointments.filter(existing =>
    existing.id !== appointment.id &&
    existing.start < appointment.end &&
    existing.end > appointment.start &&
    (!existing.resourceId || !appointment.resourceId || existing.resourceId === appointment.resourceId)
  )
}

export function canAddAppointment(appointment: Appointment, appointments: Appointment[], allowOverlap: boolean = false): boolean {
  if (allowOverlap) return true
  return !hasConflict(appointment, appointments)
}