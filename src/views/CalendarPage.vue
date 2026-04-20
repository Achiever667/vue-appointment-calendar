<!-- src/views/CalendarPage.vue -->
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
    start: new Date(2026, 11, 16, 9, 0), // Dec 16, 2026, 9:00 AM
    end: new Date(2026, 11, 16, 9, 30), // Dec 16, 2026, 9:30 AM
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
    start: new Date(2026, 11, 16, 14, 0), // Dec 16, 2026, 2:00 PM
    end: new Date(2026, 11, 16, 15, 30), // Dec 16, 2026, 3:30 PM
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
    start: new Date(2026, 11, 17, 10, 0), // Dec 17, 2026, 10:00 AM
    end: new Date(2026, 11, 17, 11, 30), // Dec 17, 2026, 11:30 AM
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
  },
  {
    id: '4',
    title: 'Code Review',
    description: 'Review pull request for new feature implementation',
    start: new Date(2026, 11, 19, 13, 0), // Dec 19, 2026, 1:00 PM
    end: new Date(2026, 11, 19, 14, 0), // Dec 19, 2026, 2:00 PM
    color: 'bg-orange-500',
    user: {
      id: 'user1',
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    attendees: [
      { id: 'user1', name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      { id: 'user2', name: 'Bob Smith', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      { id: 'user5', name: 'Eve Garcia', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' }
    ],
    location: 'GitHub PR #123',
    notes: 'Focus on code quality, performance, and security considerations'
  },
  {
    id: '5',
    title: 'Design Workshop',
    description: 'UI/UX design workshop for new dashboard',
    start: new Date(2026, 11, 19, 15, 0), // Dec 19, 2026, 3:00 PM
    end: new Date(2026, 11, 19, 16, 30), // Dec 19, 2026, 4:30 PM
    color: 'bg-pink-500',
    user: {
      id: 'user4',
      name: 'David Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    attendees: [
      { id: 'user4', name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
      { id: 'user3', name: 'Carol Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
    ],
    location: 'Design Studio',
    notes: 'Brainstorm dashboard improvements and user experience enhancements'
  },
  {
    id: '6',
    title: 'Lunch Break',
    description: 'Team lunch and casual discussion',
    start: new Date(2026, 11, 20, 12, 0), // Dec 20, 2026, 12:00 PM
    end: new Date(2026, 11, 20, 13, 0), // Dec 20, 2026, 1:00 PM
    color: 'bg-yellow-500',
    user: {
      id: 'user5',
      name: 'Eve Garcia',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    attendees: [
      { id: 'user5', name: 'Eve Garcia', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
      { id: 'user1', name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      { id: 'user2', name: 'Bob Smith', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      { id: 'user3', name: 'Carol Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
      { id: 'user4', name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }
    ],
    location: 'Cafeteria',
    notes: 'Casual team bonding and discussion of work-life balance'
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

// Sync appointments when calendar updates
watch(() => calendarRef.value?.appointments, (newAppointments) => {
  if (newAppointments && Array.isArray(newAppointments.value)) {
    appointments.value = newAppointments.value
  }
}, { deep: true })

const handleEvent = (event: CalendarEvent) => {
  console.log('Calendar event:', event)

  if (event.type === 'slot-click') {
    // Handle slot click - open appointment creation modal
    const slot = event.payload
    console.log('Clicked slot:', slot.start.toLocaleString(), 'to', slot.end.toLocaleString())
    selectedSlot.value = slot
    selectedAppointment.value = null
    isModalOpen.value = true
  } else if (event.type === 'appointment-click') {
    // Handle appointment click - open appointment details modal
    const appointment = event.payload
    console.log('Clicked appointment:', appointment.title)
    selectedAppointment.value = appointment
    selectedSlot.value = null
    isModalOpen.value = true
  }
}

const handleSaveAppointment = (appointment: Appointment) => {
  if (selectedAppointment.value) {
    // Update existing
    const success = calendarRef.value.updateExistingAppointment(appointment.id, appointment)
    if (success) {
      console.log('Appointment updated:', appointment.title)
    }
  } else {
    // Add new
    const success = calendarRef.value.addNewAppointment(appointment)
    if (success) {
      console.log('Appointment added:', appointment.title)
    }
  }
}

const handleDeleteAppointment = (id: string) => {
  const success = calendarRef.value.removeExistingAppointment(id)
  if (success) {
    console.log('Appointment deleted:', id)
  }
}

</script>

<template>
  <div class="calendar-page p-6 max-w-7xl mx-auto">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-3xl font-bold text-gray-900">Appointment Calendar</h1>
        <button
          @click="isModalOpen = true; selectedAppointment = null; selectedSlot = null"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
        >
          + New Appointment
        </button>
      </div>
      <p class="text-gray-600">Manage your appointments and schedule</p>
      <div class="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">✨ Features Demonstrated</h3>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• <strong>User Avatars & Initials:</strong> Each appointment shows the attendee's avatar or initials</li>
          <li>• <strong>Rich Tooltips:</strong> Hover over any appointment to see full details</li>
          <li>• <strong>Complete Information:</strong> Title, description, time, date, location, and attendees</li>
          <li>• <strong>Multiple Views:</strong> Switch between Month, Week, and Day views</li>
          <li>• <strong>Add/Edit/Delete:</strong> Click on appointments to edit or delete them</li>
          <li>• <strong>Create from Slots:</strong> Click on empty time slots to create appointments</li>
        </ul>
      </div>
    </div>

    <Calendar
      ref="calendarRef"
      :appointments="appointments"
      :config="config"
      view-mode="month"
      @event="handleEvent"
    />

    <!-- Appointment Modal -->
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
</template>