<!-- src/components/MonthView.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { getDaysInMonth, isSameMonth } from '../utils/date'
import AppointmentItem from './AppointmentItem.vue'
import type { Appointment, CalendarConfig } from '../types'

const props = defineProps<{
  appointments: Appointment[]
  currentDate: Date
  config?: CalendarConfig
}>()

const emit = defineEmits<{
  appointmentClick: [appointment: Appointment]
  dateChange: [date: Date]
}>()

const daysInMonth = computed(() => getDaysInMonth(props.currentDate))

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const appointmentsByDate = computed(() => {
  const map = new Map<string, Appointment[]>()
  props.appointments.forEach(appointment => {
    const dateKey = appointment.start.toDateString()
    if (!map.has(dateKey)) {
      map.set(dateKey, [])
    }
    map.get(dateKey)!.push(appointment)
  })
  return map
})

const getAppointmentsForDate = (date: Date): Appointment[] => {
  return appointmentsByDate.value.get(date.toDateString()) || []
}

const handleDateClick = (date: Date) => {
  emit('dateChange', date)
}

const handleAppointmentClick = (appointment: Appointment) => {
  emit('appointmentClick', appointment)
}
</script>

<template>
  <div class="vac-month-view">
    <!-- Week day headers -->
    <div class="grid grid-cols-7 gap-px mb-1">
      <div
        v-for="day in weekDays"
        :key="day"
        class="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
      <div
        v-for="date in daysInMonth"
        :key="date.toISOString()"
        :class="[
          'min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors',
          !isSameMonth(date, currentDate) ? 'text-gray-400 bg-gray-50' : 'text-gray-900'
        ]"
        @click="handleDateClick(date)"
      >
        <div class="text-sm font-medium mb-1">
          {{ date.getDate() }}
        </div>

        <div class="space-y-1 max-h-[100px] overflow-hidden">
          <AppointmentItem
            v-for="appointment in getAppointmentsForDate(date).slice(0, 3)"
            :key="appointment.id"
            :appointment="appointment"
            :show-description="false"
            :show-attendee="false"
            class="text-xs"
            @click="handleAppointmentClick"
          />

          <div
            v-if="getAppointmentsForDate(date).length > 3"
            class="text-xs text-gray-500 px-2 py-1"
          >
            +{{ getAppointmentsForDate(date).length - 3 }} more
          </div>
        </div>
      </div>
    </div>
  </div>
</template>