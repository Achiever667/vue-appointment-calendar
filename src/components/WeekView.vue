<!-- src/components/WeekView.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { getWeekDays, isSameDay, addMinutes } from '../utils/date'
import AppointmentItem from './AppointmentItem.vue'
import type { Appointment, CalendarConfig } from '../types'

const props = defineProps<{
  appointments: Appointment[]
  currentDate: Date
  config?: CalendarConfig
}>()

const emit = defineEmits<{
  appointmentClick: [appointment: Appointment]
  slotClick: [slot: { start: Date; end: Date }]
}>()

const weekDays = computed(() => getWeekDays(props.currentDate))
const startHour = props.config?.startHour || 8
const endHour = props.config?.endHour || 17
const slotDuration = props.config?.slotDuration || 30

const hours = computed(() => {
  const hrs = []
  for (let h = startHour; h <= endHour; h++) {
    hrs.push(h)
  }
  return hrs
})

const appointmentsByDay = computed(() => {
  const map = new Map<string, Appointment[]>()
  weekDays.value.forEach(day => {
    const dayKey = day.toDateString()
    const dayAppointments = props.appointments.filter(app => isSameDay(app.start, day))
    map.set(dayKey, dayAppointments)
  })
  return map
})

const getAppointmentsForDay = (date: Date): Appointment[] => {
  return appointmentsByDay.value.get(date.toDateString()) || []
}

const getAppointmentStyle = (appointment: Appointment) => {
  const dayStart = new Date(appointment.start)
  dayStart.setHours(startHour, 0, 0, 0)

  const startMinutes = (appointment.start.getTime() - dayStart.getTime()) / (1000 * 60)
  const durationMinutes = (appointment.end.getTime() - appointment.start.getTime()) / (1000 * 60)

  const totalMinutes = (endHour - startHour) * 60
  const topPercent = (startMinutes / totalMinutes) * 100
  const heightPercent = Math.max((durationMinutes / totalMinutes) * 100, 2) // minimum 2% height

  return {
    top: `${topPercent}%`,
    height: `${heightPercent}%`,
    backgroundColor: appointment.color || '#3b82f6'
  }
}

const handleAppointmentClick = (appointment: Appointment) => {
  emit('appointmentClick', appointment)
}

const handleTimeSlotClick = (date: Date, hour: number) => {
  const start = new Date(date)
  start.setHours(hour, 0, 0, 0)
  const end = addMinutes(start, slotDuration)

  emit('slotClick', { start, end })
}
</script>

<template>
  <div class="vac-week-view overflow-x-auto">
    <div class="min-w-[800px]">
      <!-- Header -->
      <div class="grid grid-cols-8 gap-px mb-1">
        <div class="p-2"></div>
        <div
          v-for="day in weekDays"
          :key="day.toISOString()"
          class="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50"
        >
          <div>{{ day.toLocaleDateString('en-US', { weekday: 'short' }) }}</div>
          <div class="text-xs">{{ day.getDate() }}</div>
        </div>
      </div>

      <!-- Time grid -->
      <div class="relative" :style="{ height: `${hours.length * 60}px` }">
        <div
          v-for="hour in hours"
          :key="hour"
          class="grid grid-cols-8 gap-px"
          :style="{ height: '60px' }"
        >
          <!-- Time label -->
          <div class="bg-gray-50 p-2 text-xs text-gray-500 border-r border-gray-200 flex items-start">
            {{ hour }}:00
          </div>

          <!-- Day columns -->
          <div
            v-for="day in weekDays"
            :key="`${day.toISOString()}-${hour}`"
            class="bg-white border-r border-b border-gray-200 relative cursor-pointer hover:bg-gray-50 transition-colors"
            @click="handleTimeSlotClick(day, hour)"
          >
          </div>
        </div>

        <!-- Appointments overlay -->
        <div class="absolute inset-0 grid grid-cols-8 gap-px pointer-events-none" :style="{ height: `${hours.length * 60}px` }">
          <div></div> <!-- Empty time column -->
          <div
            v-for="day in weekDays"
            :key="`appointments-${day.toISOString()}`"
            class="relative"
          >
            <div
              v-for="appointment in getAppointmentsForDay(day)"
              :key="appointment.id"
              :style="getAppointmentStyle(appointment)"
              class="absolute left-1 right-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto z-10 overflow-hidden"
              @click.stop="handleAppointmentClick(appointment)"
            >
              <AppointmentItem
                :appointment="appointment"
                :show-description="false"
                :show-attendee="false"
                class="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>