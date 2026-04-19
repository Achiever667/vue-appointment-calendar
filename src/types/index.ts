// src/types/index.ts
export interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  resourceId?: string
  color?: string
  description?: string
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

export interface CalendarEvent {
  type: 'appointment-click' | 'slot-click' | 'date-change' | 'view-change'
  payload: any
}

export type ViewMode = 'day' | 'week' | 'month'