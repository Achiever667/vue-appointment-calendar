<template>
  <div v-if="isOpen" class="fixed inset-0 z-50">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="closeModal"
    ></div>

    <!-- Modal -->
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-hidden"
        @click.stop
      >
      <div class="">
      
      
        <!-- Header -->
        <div class="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Appointment' : 'New Appointment' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700 transition-colors"
            type="button"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="Appointment title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="formData.description"
              placeholder="Appointment description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <!-- Start Date/Time -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                v-model="formData.startDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                v-model="formData.startTime"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <!-- End Date/Time -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                v-model="formData.endDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                v-model="formData.endTime"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              v-model="formData.location"
              type="text"
              placeholder="Meeting location or URL"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="formData.notes"
              placeholder="Additional notes"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <!-- Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div class="flex gap-2">
              <button
                v-for="color in colorOptions"
                :key="color"
                type="button"
                @click="formData.color = color"
                :class="[
                  'w-8 h-8 rounded-full transition-transform',
                  color,
                  formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                ]"
              ></button>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {{ errorMessage }}
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              v-if="isEditMode"
              type="button"
              @click="handleDelete"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <div class="flex-1"></div>
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {{ isEditMode ? 'Update' : 'Add' }} Appointment
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Appointment } from '../types'

interface Props {
  isOpen: boolean
  appointment?: Appointment | null
  slotStart?: Date
  slotEnd?: Date
}

interface Emits {
  (e: 'close'): void
  (e: 'save', appointment: Appointment): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const colorOptions = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500'
]

const isEditMode = computed(() => !!props.appointment)

const formData = reactive({
  title: '',
  description: '',
  location: '',
  notes: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  color: 'bg-blue-500'
})

const errorMessage = ref('')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    errorMessage.value = ''
    if (props.appointment) {
      // Edit mode
      const start = new Date(props.appointment.start)
      const end = new Date(props.appointment.end)
      
      formData.title = props.appointment.title || ''
      formData.description = props.appointment.description || ''
      formData.location = props.appointment.location || ''
      formData.notes = props.appointment.notes || ''
      formData.startDate = start.toISOString().split('T')[0]
      formData.startTime = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`
      formData.endDate = end.toISOString().split('T')[0]
      formData.endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`
      formData.color = props.appointment.color || 'bg-blue-500'
    } else if (props.slotStart && props.slotEnd) {
      // New appointment from slot
      const start = new Date(props.slotStart)
      const end = new Date(props.slotEnd)
      
      formData.title = ''
      formData.description = ''
      formData.location = ''
      formData.notes = ''
      formData.startDate = start.toISOString().split('T')[0]
      formData.startTime = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`
      formData.endDate = end.toISOString().split('T')[0]
      formData.endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`
      formData.color = 'bg-blue-500'
    } else {
      // New appointment without slot
      const now = new Date()
      const later = new Date(now.getTime() + 60 * 60 * 1000)
      
      formData.title = ''
      formData.description = ''
      formData.location = ''
      formData.notes = ''
      formData.startDate = now.toISOString().split('T')[0]
      formData.startTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      formData.endDate = later.toISOString().split('T')[0]
      formData.endTime = `${String(later.getHours()).padStart(2, '0')}:${String(later.getMinutes()).padStart(2, '0')}`
      formData.color = 'bg-blue-500'
    }
  }
}, { immediate: true })

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  errorMessage.value = ''

  if (!formData.title.trim()) {
    errorMessage.value = 'Title is required'
    return
  }

  const start = new Date(`${formData.startDate}T${formData.startTime}`)
  const end = new Date(`${formData.endDate}T${formData.endTime}`)

  if (start >= end) {
    errorMessage.value = 'End time must be after start time'
    return
  }

  const appointment: Appointment = {
    id: props.appointment?.id || `appt-${Date.now()}`,
    title: formData.title,
    description: formData.description,
    location: formData.location,
    notes: formData.notes,
    start,
    end,
    color: formData.color,
    user: props.appointment?.user || {
      id: 'user-current',
      name: 'Current User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    attendees: props.appointment?.attendees || []
  }

  emit('save', appointment)
  closeModal()
}

const handleDelete = () => {
  if (props.appointment) {
    emit('delete', props.appointment.id)
    closeModal()
  }
}
</script>
