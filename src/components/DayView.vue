<!-- src/components/DayView.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { getTimeSlots, formatTime, addMinutes } from '../utils/date'
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

const startHour = props.config?.startHour || 8
const endHour = props.config?.endHour || 17
const slotDuration = props.config?.slotDuration || 30

const timeSlots = computed(() => {
  const slots = getTimeSlots(startHour, endHour, slotDuration)
  return slots.map(slotTime => {
    const slotStart = new Date(props.currentDate)
    slotStart.setHours(slotTime.getHours(), slotTime.getMinutes(), 0, 0)
    const slotEnd = addMinutes(slotStart, slotDuration)

    return {
      start: slotStart,
      end: slotEnd,
      appointments: props.appointments.filter(app =>
        app.start < slotEnd && app.end > slotStart
      )
    }
  })
})

const allDayAppointments = computed(() => {
  return props.appointments.filter(app => {
    const appStart = new Date(app.start)
    const appEnd = new Date(app.end)
    return appStart.getHours() < startHour || appEnd.getHours() > endHour
  })
})

const handleAppointmentClick = (appointment: Appointment) => {
  emit('appointmentClick', appointment)
}

const handleSlotClick = (slot: { start: Date; end: Date }) => {
  emit('slotClick', slot)
}
</script>

<template>
  <div class="vac-day-view">
    <!-- All day appointments -->
    <div v-if="allDayAppointments.length > 0" class="mb-4">
      <h3 class="text-sm font-medium text-gray-700 mb-2">All Day</h3>
      <div class="space-y-1">
        <div
          v-for="appointment in allDayAppointments"
          :key="appointment.id"
          :class="[
            'p-2 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity',
            appointment.color || 'bg-blue-100 text-blue-800'
          ]"
          @click="handleAppointmentClick(appointment)"
        >
          {{ appointment.title }}
        </div>
      </div>
    </div>

    <!-- Time slots -->
    <div class="space-y-1">
      <div
        v-for="slot in timeSlots"
        :key="slot.start.toISOString()"
        :class="[
          'flex border border-gray-200 rounded p-2 cursor-pointer hover:bg-gray-50 transition-colors min-h-[40px]',
          slot.appointments.length > 0 ? 'bg-blue-50' : 'bg-white'
        ]"
        @click="handleSlotClick(slot)"
      >
        <div class="text-xs text-gray-500 w-16 flex-shrink-0">
          {{ formatTime(slot.start) }}
        </div>

        <div class="flex-1 ml-2">
          <div
            v-for="appointment in slot.appointments"
            :key="appointment.id"
            :class="[
              'text-sm p-1 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity',
              appointment.color || 'bg-blue-100 text-blue-800'
            ]"
            @click.stop="handleAppointmentClick(appointment)"
          >
            {{ appointment.title }}
            <span class="text-xs opacity-75">
              ({{ formatTime(appointment.start) }} - {{ formatTime(appointment.end) }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>