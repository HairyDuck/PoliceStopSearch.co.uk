<template>
  <div class="date-picker">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <div class="flex flex-wrap gap-2">
      <!-- Month Buttons -->
      <button
        v-for="date in availableMonths"
        :key="date.value"
        class="date-button month-button"
        :class="{
          'selected': selectedMonths.includes(date.value),
          'available': true
        }"
        @click="toggleMonth(date.value)"
      >
        {{ formatMonthShort(date.value) }}
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { format, subMonths, isAfter, isBefore, parse } from 'date-fns'
import { useStopSearchStore } from '../stores/stopsearch'

const props = defineProps<{
  modelValue: string[]
  label?: string
  id?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', value: string[]): void
}>()

const store = useStopSearchStore()
const isLoading = ref(false)
const error = ref('')
const selectedMonths = ref<string[]>(props.modelValue || [])

interface DateOption {
  value: string
  label: string
  disabled: boolean
}

// Format the month in short format (e.g., "Jan 2024")
const formatMonthShort = (date: string) => {
  if (!date || date === 'latest') return 'Latest'
  try {
    const parsed = parse(date, 'yyyy-MM', new Date())
    return format(parsed, 'MMM yyyy')
  } catch {
    return date
  }
}

// Update availableMonths computed
const availableMonths = computed<DateOption[]>(() => {
  const dates: DateOption[] = []
  const today = new Date()
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const twoYearsAgo = subMonths(today, 24)
  
  // Get all dates from the store's available datasets
  store.availableDatasets
    .filter(dataset => dataset['stop-and-search']?.length > 0)
    .forEach(dataset => {
      try {
        const date = parse(dataset.date, 'yyyy-MM', new Date())
        // Only include if within valid range and has data
        if (!isAfter(date, currentMonth) && !isBefore(date, twoYearsAgo)) {
          const value = format(date, 'yyyy-MM')
          const label = format(date, 'MMMM yyyy')
          dates.push({ value, label, disabled: false })
        }
      } catch (error) {
        console.error('Error parsing date:', error)
      }
    })
  
  return dates.sort((a, b) => b.value.localeCompare(a.value))
})

// Get the reason why a date is disabled
const getDisabledReason = (date: DateOption) => {
  const selectedDate = parse(date.value, 'yyyy-MM', new Date())
  const today = new Date()
  
  if (isAfter(selectedDate, today)) {
    return 'Future date not available'
  }
  if (isBefore(selectedDate, subMonths(today, 24))) {
    return 'Data older than 24 months'
  }
  if (!store.isDateAvailable(date.value)) {
    return 'No data available for this month'
  }
  return 'Not available'
}

// Update toggleMonth function
const toggleMonth = (value: string) => {
  const index = selectedMonths.value.indexOf(value)
  if (index === -1) {
    // Add the month to selections
    selectedMonths.value.push(value)
  } else {
    // Remove the month from selections
    selectedMonths.value.splice(index, 1)
  }
  emit('update:modelValue', selectedMonths.value)
  emit('change', selectedMonths.value)
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  selectedMonths.value = newValue || []
})

// Lifecycle hooks
onMounted(async () => {
  try {
    await store.fetchAvailableDatasets()
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Failed to fetch available dates'
    }
  }
})
</script>

<style scoped>
.date-picker {
  @apply w-full;
}

.date-button {
  @apply px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary;
}

.month-button {
  @apply bg-white border border-gray-300 text-gray-700 min-w-[80px] text-center;
}

.month-button:not(.disabled):hover {
  @apply bg-gray-50 border-primary;
}

.month-button.selected {
  @apply bg-primary text-white border-primary;
}

.month-button.disabled {
  @apply bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200;
}

.month-button.available {
  @apply hover:bg-primary hover:text-white hover:border-primary;
}

.loading-spinner {
  @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
}

.error-message {
  @apply flex items-center mt-2 text-sm text-red-600;
}

.error-icon {
  @apply w-4 h-4 mr-1;
}
</style> 