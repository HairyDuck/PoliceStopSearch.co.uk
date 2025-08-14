<template>
  <div class="mobile-date-picker">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>

    <!-- Mobile-friendly dropdown -->
    <div class="relative">
      <select
        :id="id"
        v-model="selectedValue"
        @change="handleChange"
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      >
        <option value="latest">Latest Available</option>
        <option 
          v-for="date in availableMonths" 
          :key="date.value" 
          :value="date.value"
          :disabled="date.disabled"
        >
          {{ formatMonthLong(date.value) }}
        </option>
      </select>
      
      <!-- Selected months display -->
      <div v-if="selectedMonths.length > 1" class="mt-2">
        <div class="text-xs text-gray-500 mb-1">Selected months:</div>
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="month in selectedMonths" 
            :key="month"
            class="inline-flex items-center px-2 py-1 text-xs bg-primary text-white rounded-full"
          >
            {{ formatMonthShort(month) }}
            <button 
              @click="removeMonth(month)"
              class="ml-1 text-white hover:text-gray-200"
            >
              ×
            </button>
          </span>
        </div>
      </div>
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
const selectedValue = ref('latest')

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

// Format the month in long format (e.g., "January 2024")
const formatMonthLong = (date: string) => {
  if (!date || date === 'latest') return 'Latest Available'
  try {
    const parsed = parse(date, 'yyyy-MM', new Date())
    return format(parsed, 'MMMM yyyy')
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

// Handle dropdown change
const handleChange = () => {
  if (selectedValue.value === 'latest') {
    selectedMonths.value = ['latest']
  } else {
    // Add the selected month if not already selected
    if (!selectedMonths.value.includes(selectedValue.value)) {
      selectedMonths.value.push(selectedValue.value)
    }
  }
  emit('update:modelValue', selectedMonths.value)
  emit('change', selectedMonths.value)
}

// Remove a month from selection
const removeMonth = (month: string) => {
  const index = selectedMonths.value.indexOf(month)
  if (index > -1) {
    selectedMonths.value.splice(index, 1)
    emit('update:modelValue', selectedMonths.value)
    emit('change', selectedMonths.value)
  }
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
.mobile-date-picker {
  @apply w-full;
}

.error-message {
  @apply flex items-center mt-2 text-sm text-red-600;
}

.error-icon {
  @apply w-4 h-4 mr-1;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  select {
    @apply text-base py-3; /* Larger touch targets */
  }
}
</style> 