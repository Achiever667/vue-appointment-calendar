<template>
  <div
    ref="triggerRef"
    :class="[
      'flex items-center gap-2 p-2 rounded text-white text-xs cursor-pointer hover:brightness-105 transition-all relative group overflow-visible',
      appointment.color || 'bg-blue-600'
    ]"
    @click.stop="$emit('click', appointment)"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focusin="showTooltip"
    @focusout="hideTooltip"
  >
    <div class="flex-shrink-0">
      <div
        v-if="appointment.user?.avatar"
        class="w-6 h-6 rounded-full ring-1 ring-white/30 flex items-center justify-center overflow-hidden"
      >
        <img
          :src="appointment.user.avatar"
          :alt="appointment.user.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        v-else-if="appointment.user?.initials || getInitials(appointment.user?.name)"
        class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold"
      >
        {{ appointment.user?.initials || getInitials(appointment.user?.name) }}
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <div class="font-semibold truncate">
        {{ appointment.title }}
      </div>
      <div v-if="appointment.user?.name && showAttendee" class="text-[10px] opacity-90 truncate">
        {{ appointment.user.name }}
      </div>
    </div>

    <div
      v-show="isTooltipVisible"
      ref="tooltipRef"
      :class="[
        'absolute left-0 z-[100] w-64 rounded-lg border border-slate-200 bg-white p-3 text-slate-800 shadow-xl pointer-events-none',
        tooltipPlacement === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
      ]"
    >
      <div class="flex items-start gap-2 mb-2 border-b border-slate-100 pb-2">
        <div :class="['w-1.5 h-8 rounded-full shrink-0', appointment.color || 'bg-blue-600']"></div>
        <div class="min-w-0">
          <div class="font-bold text-sm text-slate-900 leading-tight truncate">
            {{ appointment.title }}
          </div>
          <div class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            {{ formatDate(appointment.start) }}
          </div>
        </div>
      </div>

      <div class="space-y-2 text-[11px]">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 font-medium w-12 shrink-0">Time</span>
          <span class="text-slate-700">{{ formatTime(appointment.start) }} - {{ formatTime(appointment.end) }}</span>
        </div>

        <div v-if="appointment.user?.name" class="flex items-center gap-2">
          <span class="text-slate-400 font-medium w-12 shrink-0">Host</span>
          <span class="text-slate-700 font-medium">{{ appointment.user.name }}</span>
        </div>

        <div v-if="appointment.location" class="flex items-center gap-2">
          <span class="text-slate-400 font-medium w-12 shrink-0">Where</span>
          <span class="text-slate-700 truncate">{{ appointment.location }}</span>
        </div>

        <div v-if="appointment.description" class="pt-1 mt-1 border-t border-slate-50">
          <p class="text-slate-500 leading-relaxed italic">
            {{ appointment.description }}
          </p>
        </div>

        <div v-if="appointment.attendees?.length" class="pt-2">
          <div class="text-[10px] text-slate-400 font-bold uppercase mb-1">Attendees</div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="person in appointment.attendees"
              :key="person.name"
              class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]"
            >
              {{ person.name }}
            </span>
          </div>
        </div>
      </div>

      <div
        :class="[
          'absolute left-4 h-3 w-3 rotate-45 bg-white',
          tooltipPlacement === 'top'
            ? '-bottom-1.5 border-r border-b border-slate-200'
            : '-top-1.5 border-l border-t border-slate-200'
        ]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Appointment } from '../types'

defineProps<{
  appointment: Appointment
  showDescription?: boolean
  showAttendee?: boolean
}>()

defineEmits<{
  click: [appointment: Appointment]
}>()

const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const isTooltipVisible = ref(false)
const tooltipPlacement = ref<'top' | 'bottom'>('top')

const updateTooltipPosition = () => {
  if (!isTooltipVisible.value) return

  const trigger = triggerRef.value
  const tooltip = tooltipRef.value

  if (!trigger || !tooltip) return

  const triggerRect = trigger.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const gap = 12
  const spaceAbove = triggerRect.top
  const spaceBelow = window.innerHeight - triggerRect.bottom

  tooltipPlacement.value =
    spaceAbove < tooltipRect.height + gap && spaceBelow > spaceAbove ? 'bottom' : 'top'
}

const showTooltip = async () => {
  isTooltipVisible.value = true
  await nextTick()
  updateTooltipPosition()
}

const hideTooltip = () => {
  isTooltipVisible.value = false
}

watch(isTooltipVisible, visible => {
  if (typeof window === 'undefined') return

  if (visible) {
    window.addEventListener('scroll', updateTooltipPosition, true)
    window.addEventListener('resize', updateTooltipPosition)
    return
  }

  window.removeEventListener('scroll', updateTooltipPosition, true)
  window.removeEventListener('resize', updateTooltipPosition)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', updateTooltipPosition, true)
  window.removeEventListener('resize', updateTooltipPosition)
})

const getInitials = (name?: string): string => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}
</script>
