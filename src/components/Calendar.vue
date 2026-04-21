<!-- src/components/Calendar.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useCalendar, useAppointments } from '../composables'
import MonthView from './MonthView.vue'
import WeekView from './WeekView.vue'
import DayView from './DayView.vue'
import type { Appointment, CalendarApiConfig, CalendarConfig, CalendarEvent, ViewMode } from '../types'

const props = defineProps<{
  appointments?: Appointment[]
  apiConfig?: CalendarApiConfig
  config?: CalendarConfig
  viewMode?: 'day' | 'week' | 'month'
}>()

const emit = defineEmits<{
  event: [event: CalendarEvent]
}>()

const mergedConfig = computed(() => ({
  ...props.config,
  view: props.viewMode || props.config?.view || 'month'
}))

const viewOptions: ViewMode[] = ['month', 'week', 'day']

const { view, currentDate, navigateToNext, navigateToPrevious, navigateToToday, setView } = useCalendar(mergedConfig.value)
const { appointments, fetchAppointments, addAppointment, updateAppointment, removeAppointment } = useAppointments(
  props.appointments || [],
  props.apiConfig
)

// Expose appointment management functions
const addNewAppointment = async (appointment: Appointment): Promise<boolean> => {
  const success = await addAppointment(appointment, props.config?.allowOverlap || false)
  if (success) {
    emit('event', { type: 'appointment-added', payload: appointment })
  }
  return success
}

const updateExistingAppointment = async (id: string, updates: Partial<Appointment>): Promise<boolean> => {
  const success = await updateAppointment(id, updates, props.config?.allowOverlap || false)
  if (success) {
    const updated = appointments.value.find(a => a.id === id)
    if (updated) {
      emit('event', { type: 'appointment-updated', payload: updated })
    }
  }
  return success
}

const removeExistingAppointment = async (id: string): Promise<boolean> => {
  const success = await removeAppointment(id)
  if (success) {
    emit('event', { type: 'appointment-removed', payload: { id } })
  }
  return success
}

// Expose functions and state for parent components
defineExpose({
  appointments,
  fetchAppointments,
  addNewAppointment,
  updateExistingAppointment,
  removeExistingAppointment
})

const currentViewComponent = computed(() => {
  switch (view.value) {
    case 'month':
      return MonthView
    case 'week':
      return WeekView
    case 'day':
      return DayView
    default:
      return MonthView
  }
})

const handleViewChange = (newView: ViewMode) => {
  setView(newView)
  emit('event', { type: 'view-change', payload: { view: newView } })
}

const handleAppointmentClick = (appointment: Appointment) => {
  emit('event', { type: 'appointment-click', payload: appointment })
}

const handleSlotClick = (slot: { start: Date; end: Date }) => {
  emit('event', { type: 'slot-click', payload: slot })
}

const handleDateChange = (date: Date) => {
  emit('event', { type: 'date-change', payload: { date } })
}
</script>

<template>
  <div class="vac-calendar bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center space-x-2">
        <button
          @click="navigateToPrevious"
          class="p-2 hover:bg-gray-100 rounded-md transition-colors"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <button
          @click="navigateToToday"
          class="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          type="button"
        >
          Today
        </button>

        <button
          @click="navigateToNext"
          class="p-2 hover:bg-gray-100 rounded-md transition-colors"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <h2 class="text-lg font-semibold text-gray-900 ml-4">
          {{ currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}
        </h2>
      </div>

      <div class="flex items-center space-x-1">
        <button
          v-for="viewOption in viewOptions"
          :key="viewOption"
          @click="handleViewChange(viewOption)"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md transition-colors capitalize',
            view === viewOption
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
          type="button"
        >
          {{ viewOption }}
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="p-4">
      <component
        :is="currentViewComponent"
        :appointments="appointments"
        :current-date="currentDate"
        :config="props.config"
        @appointment-click="handleAppointmentClick"
        @slot-click="handleSlotClick"
        @date-change="handleDateChange"
      />
    </div>
  </div>
</template>
