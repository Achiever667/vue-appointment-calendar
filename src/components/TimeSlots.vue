<!-- src/components/TimeSlots.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { getTimeSlots, formatTime, addMinutes } from '../utils/date'
import type { Appointment, CalendarConfig } from '../types'

const props = defineProps<{
  date: Date
  appointments: Appointment[]
  config?: CalendarConfig
}>()

const emit = defineEmits<{
  slotClick: [slot: { start: Date; end: Date }]
}>()

const startHour = props.config?.startHour || 8
const endHour = props.config?.endHour || 17
const slotDuration = props.config?.slotDuration || 30

const timeSlots = computed(() => {
  const slots = getTimeSlots(startHour, endHour, slotDuration)
  return slots.map(slotTime => {
    const slotStart = new Date(props.date)
    slotStart.setHours(slotTime.getHours(), slotTime.getMinutes(), 0, 0)
    const slotEnd = addMinutes(slotStart, slotDuration)

    const slotAppointments = props.appointments.filter(app =>
      app.start < slotEnd && app.end > slotStart
    )

    return {
      start: slotStart,
      end: slotEnd,
      appointments: slotAppointments,
      available: slotAppointments.length === 0
    }
  })
})

const handleSlotClick = (slot: { start: Date; end: Date; available: boolean }) => {
  if (slot.available) {
    emit('slotClick', { start: slot.start, end: slot.end })
  }
}
</script>

<template>
  <div class="vac-time-slots space-y-1">
    <div
      v-for="slot in timeSlots"
      :key="slot.start.toISOString()"
      :class="[
        'flex items-center p-2 border rounded cursor-pointer transition-colors',
        slot.available
          ? 'border-gray-200 hover:bg-gray-50'
          : 'border-blue-200 bg-blue-50'
      ]"
      @click="handleSlotClick(slot)"
    >
      <div class="text-sm text-gray-600 w-20">
        {{ formatTime(slot.start) }}
      </div>

      <div class="flex-1 ml-2">
        <div
          v-if="slot.appointments.length > 0"
          class="text-sm text-blue-800"
        >
          {{ slot.appointments.length }} appointment{{ slot.appointments.length > 1 ? 's' : '' }}
        </div>
        <div v-else class="text-sm text-gray-400">
          Available
        </div>
      </div>
    </div>
  </div>
</template>