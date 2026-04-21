<script setup lang="ts">
import { ref, watch } from 'vue'
import Calendar from '../components/Calendar.vue'
import AppointmentModal from '../components/AppointmentModal.vue'
import type { Appointment, CalendarConfig, CalendarEvent } from '../types'

const calendarRef = ref()
const isModalOpen = ref(false)
const selectedAppointment = ref<Appointment | null>(null)
const selectedSlot = ref<{ start: Date; end: Date } | null>(null)

const appointments = ref<Appointment[]>([
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily team standup meeting',
    start: new Date(2026, 11, 16, 9, 0),
    end: new Date(2026, 11, 16, 9, 30),
    color: 'bg-green-500',
    user: {
      id: 'user1',
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    attendees: [
      { id: 'user1', name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      { id: 'user2', name: 'Bob Smith', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }
    ],
    location: 'Conference Room A',
    notes: 'Discuss daily progress and blockers'
  },
  {
    id: '2',
    title: 'Client Meeting',
    description: 'Quarterly review with client',
    start: new Date(2026, 11, 16, 14, 0),
    end: new Date(2026, 11, 16, 15, 30),
    color: 'bg-blue-500',
    user: {
      id: 'user3',
      name: 'Carol Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    attendees: [
      { id: 'user3', name: 'Carol Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
      { id: 'user4', name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }
    ],
    location: 'Virtual (Zoom)',
    notes: 'Prepare quarterly reports and discuss next steps'
  },
  {
    id: '3',
    title: 'Project Planning',
    description: 'Sprint planning session',
    start: new Date(2026, 11, 17, 10, 0),
    end: new Date(2026, 11, 17, 11, 30),
    color: 'bg-purple-500',
    user: {
      id: 'user2',
      name: 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    attendees: [
      { id: 'user2', name: 'Bob Smith', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      { id: 'user1', name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      { id: 'user5', name: 'Eve Garcia', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' }
    ],
    location: 'Meeting Room B',
    notes: 'Plan next sprint tasks and assign responsibilities'
  }
])

const config = ref<CalendarConfig>({
  view: 'month',
  date: appointments.value[0]?.start || new Date(),
  slotDuration: 30,
  startHour: 8,
  endHour: 18,
  allowOverlap: false
})

watch(
  () => calendarRef.value?.appointments,
  (newAppointments) => {
    if (newAppointments && Array.isArray(newAppointments.value)) {
      appointments.value = newAppointments.value
    }
  },
  { deep: true }
)

const handleEvent = (event: CalendarEvent) => {
  if (event.type === 'slot-click') {
    selectedSlot.value = event.payload
    selectedAppointment.value = null
    isModalOpen.value = true
    return
  }

  if (event.type === 'appointment-click') {
    selectedAppointment.value = event.payload
    selectedSlot.value = null
    isModalOpen.value = true
  }
}

const handleSaveAppointment = (appointment: Appointment) => {
  if (selectedAppointment.value) {
    calendarRef.value?.updateExistingAppointment(appointment.id, appointment)
    return
  }

  calendarRef.value?.addNewAppointment(appointment)
}

const handleDeleteAppointment = (id: string) => {
  calendarRef.value?.removeExistingAppointment(id)
}

const openNewAppointmentModal = () => {
  selectedAppointment.value = null
  selectedSlot.value = null
  isModalOpen.value = true
}
</script>

<template>
  <main class="min-h-screen bg-slate-100">
    <div class="mx-auto max-w-7xl p-6 lg:p-10">
      <section class="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Demo App</p>
            <h1 class="mt-2 text-3xl font-bold text-slate-900">Vue Appointment Calendar</h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-600">
              This demo is built only for the browser app target. The reusable calendar stays exported from the library entry.
            </p>
          </div>

          <button
            type="button"
            class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            @click="openNewAppointmentModal"
          >
            New Appointment
          </button>
        </div>
      </section>

      <Calendar
        ref="calendarRef"
        :appointments="appointments"
          view-mode="week"
        :config="config"
        @event="handleEvent"
      />

      <AppointmentModal
        :is-open="isModalOpen"
        :appointment="selectedAppointment"
        :slot-start="selectedSlot?.start"
        :slot-end="selectedSlot?.end"
        @close="isModalOpen = false"
        @save="handleSaveAppointment"
        @delete="handleDeleteAppointment"
      />
    </div>
  </main>
</template>
