<!-- src/components/AppointmentItem.vue -->
<template>
  <div
    :class="[
      'flex items-center gap-2 p-2 rounded text-white text-xs cursor-pointer hover:opacity-80 transition-opacity relative group',
      appointment.color || 'bg-blue-500'
    ]"
    @click="$emit('click', appointment)"
  >
    <!-- Avatar/Initials -->
    <div class="flex-shrink-0">
      <div
        v-if="appointment.user?.avatar"
        class="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden"
      >
        <img
          :src="appointment.user.avatar"
          :alt="appointment.user.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        v-else-if="appointment.user?.initials || getInitials(appointment.user?.name)"
        class="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-xs font-medium"
      >
        {{ appointment.user?.initials || getInitials(appointment.user?.name) }}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="font-medium truncate">
        {{ appointment.title }}
      </div>
      <div
        v-if="appointment.description && showDescription"
        class="text-xs opacity-90 truncate"
      >
        {{ appointment.description }}
      </div>
      <div
        v-if="appointment.user?.name && showAttendee"
        class="text-xs opacity-75 truncate"
      >
        {{ appointment.user.name }}
      </div>
    </div>

    <!-- Tooltip -->
    <div
      class="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-max max-w-xs"
    >
      <div class="font-semibold mb-1">{{ appointment.title }}</div>
      <div class="space-y-1">
        <div v-if="appointment.user?.name">
          <span class="font-medium">Attendee:</span> {{ appointment.user.name }}
        </div>
        <div>
          <span class="font-medium">Time:</span> {{ formatTime(appointment.start) }} - {{ formatTime(appointment.end) }}
        </div>
        <div>
          <span class="font-medium">Date:</span> {{ formatDate(appointment.start) }}
        </div>
        <div v-if="appointment.description">
          <span class="font-medium">Description:</span> {{ appointment.description }}
        </div>
        <div v-if="appointment.location">
          <span class="font-medium">Location:</span> {{ appointment.location }}
        </div>
        <div v-if="appointment.notes">
          <span class="font-medium">Notes:</span> {{ appointment.notes }}
        </div>
        <div v-if="appointment.attendees && appointment.attendees.length > 0">
          <span class="font-medium">Attendees:</span>
          <div class="ml-2">
            {{ appointment.attendees.map(a => a.name).join(', ') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from '../types'

defineProps<{
  appointment: Appointment
  showDescription?: boolean
  showAttendee?: boolean
}>()

defineEmits<{
  click: [appointment: Appointment]
}>()

const getInitials = (name?: string): string => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>