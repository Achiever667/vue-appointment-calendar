// src/utils/date.ts
import type { ViewMode } from '../types'

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function startOfWeek(date: Date, weekStartsOn: number = 0): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + weekStartsOn
  return new Date(d.setDate(diff))
}

export function endOfWeek(date: Date, weekStartsOn: number = 0): Date {
  const d = startOfWeek(date, weekStartsOn)
  d.setDate(d.getDate() + 6)
  return endOfDay(d)
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function addHours(date: Date, hours: number): Date {
  const d = new Date(date)
  d.setHours(d.getHours() + hours)
  return d
}

export function addMinutes(date: Date, minutes: number): Date {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() + minutes)
  return d
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth()
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(date: Date, locale: string = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getDaysInMonth(date: Date): Date[] {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const days: Date[] = []
  let current = new Date(start)

  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}

export function getWeekDays(date: Date, weekStartsOn: number = 0): Date[] {
  const start = startOfWeek(date, weekStartsOn)
  const days: Date[] = []

  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i))
  }

  return days
}

export function getHoursInDay(startHour: number, endHour: number): number[] {
  const hours: number[] = []
  for (let h = startHour; h <= endHour; h++) {
    hours.push(h)
  }
  return hours
}

export function getTimeSlots(startHour: number, endHour: number, slotDuration: number): Date[] {
  const slots: Date[] = []
  const start = new Date()
  start.setHours(startHour, 0, 0, 0)

  const end = new Date()
  end.setHours(endHour, 0, 0, 0)

  let current = new Date(start)

  while (current < end) {
    slots.push(new Date(current))
    current = addMinutes(current, slotDuration)
  }

  return slots
}