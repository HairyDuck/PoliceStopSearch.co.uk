<template>
  <div class="data-download">
    <h2 class="text-2xl font-semibold mb-6">Download Data</h2>

    <!-- Format Selection -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">Select Format</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="format in downloadFormats"
          :key="format.value"
          class="format-button"
          :class="{ active: selectedFormat === format.value }"
          @click="selectedFormat = format.value"
        >
          <span class="format-icon">{{ format.icon }}</span>
          <span class="format-label">{{ format.label }}</span>
        </button>
      </div>
    </div>

    <!-- Time Period -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">Time Period</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="startDate">From</label>
          <input
            type="month"
            id="startDate"
            v-model="dateRange.start"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="endDate">To</label>
          <input
            type="month"
            id="endDate"
            v-model="dateRange.end"
            class="form-control"
          />
        </div>
      </div>
    </div>

    <!-- Data Options -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">Data Options</h3>
      <div class="space-y-3">
        <label
          v-for="option in dataOptions"
          :key="option.value"
          class="flex items-start"
        >
          <input
            type="checkbox"
            :value="option.value"
            v-model="selectedOptions"
            class="form-checkbox mt-1"
          />
          <div class="ml-3">
            <span class="block font-medium">{{ option.label }}</span>
            <span class="block text-sm text-gray-500">{{ option.description }}</span>
          </div>
        </label>
      </div>
    </div>

    <!-- Police Forces -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">Police Forces</h3>
      <div class="form-group">
        <select
          v-model="selectedForces"
          multiple
          class="form-control h-32"
        >
          <option
            v-for="force in policeForces"
            :key="force.id"
            :value="force.id"
          >
            {{ force.name }}
          </option>
        </select>
        <p class="text-sm text-gray-500 mt-2">
          Hold Ctrl/Cmd to select multiple forces
        </p>
      </div>
    </div>

    <!-- File Information -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium">Estimated File Size</h4>
          <p class="text-sm text-gray-500">{{ estimatedSize }}</p>
        </div>
        <div>
          <h4 class="font-medium">Records</h4>
          <p class="text-sm text-gray-500">{{ estimatedRecords }}</p>
        </div>
      </div>
    </div>

    <!-- Download Button -->
    <button
      class="download-button"
      :disabled="isDownloadDisabled"
      @click="initiateDownload"
    >
      <span v-if="isDownloading" class="loading-spinner"></span>
      <span>{{ downloadButtonText }}</span>
    </button>

    <!-- Terms -->
    <p class="text-sm text-gray-500 mt-4">
      By downloading this data, you agree to our
      <a
        href="/terms"
        class="text-primary-color hover:underline"
      >terms of use</a>
      and acknowledge the
      <a
        href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary-color hover:underline"
      >Open Government License</a>.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// Download format options
const downloadFormats = ref([
  { value: 'csv', label: 'CSV', icon: '📄' },
  { value: 'json', label: 'JSON', icon: '{ }' },
  { value: 'excel', label: 'Excel', icon: '📊' }
])

const selectedFormat = ref('csv')

// Date range
const dateRange = reactive({
  start: '',
  end: ''
})

// Data options
const dataOptions = ref([
  {
    value: 'basic',
    label: 'Basic Information',
    description: 'Date, location, type of search, and outcome'
  },
  {
    value: 'demographics',
    label: 'Demographics',
    description: 'Age range, gender, and ethnicity data'
  },
  {
    value: 'detailed',
    label: 'Detailed Information',
    description: 'Legislation, object of search, and operation details'
  },
  {
    value: 'geo',
    label: 'Geographic Data',
    description: 'Precise latitude and longitude coordinates'
  }
])

const selectedOptions = ref(['basic'])

// Police forces
const policeForces = ref([
  { id: 'met', name: 'Metropolitan Police' },
  { id: 'btp', name: 'British Transport Police' },
  { id: 'city', name: 'City of London Police' }
])

const selectedForces = ref<string[]>([])

// Computed properties
const estimatedSize = computed(() => {
  // Simple estimation based on selections
  const baseSize = 1024 // 1KB per record
  const multiplier = selectedOptions.value.length
  const records = parseInt(estimatedRecords.value.replace(/,/g, ''))
  const totalBytes = baseSize * multiplier * records

  if (totalBytes < 1024 * 1024) {
    return `${(totalBytes / 1024).toFixed(1)} KB`
  } else {
    return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
  }
})

const estimatedRecords = computed(() => {
  // Placeholder estimation logic
  return '10,000'
})

const isDownloadDisabled = computed(() => {
  return !dateRange.start || !dateRange.end || selectedOptions.value.length === 0
})

const downloadButtonText = computed(() => {
  if (isDownloading.value) {
    return 'Preparing Download...'
  }
  return `Download ${selectedFormat.value.toUpperCase()}`
})

// State
const isDownloading = ref(false)

// Methods
const initiateDownload = async () => {
  isDownloading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create download URL based on selected options
    const params = new URLSearchParams({
      format: selectedFormat.value,
      startDate: dateRange.start,
      endDate: dateRange.end,
      options: selectedOptions.value.join(','),
      forces: selectedForces.value.join(',')
    })

    const url = `/api/download?${params.toString()}`
    window.location.href = url
  } catch (error) {
    console.error('Download failed:', error)
  } finally {
    isDownloading.value = false
  }
}
</script>

<style scoped>
.data-download {
  @apply bg-white rounded-lg shadow-sm border border-gray-100 p-6;
}

.format-button {
  @apply flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-primary-color transition-colors duration-200;
}

.format-button.active {
  @apply border-primary-color bg-primary-color bg-opacity-5;
}

.format-icon {
  @apply text-2xl mb-2;
}

.format-label {
  @apply font-medium;
}

.form-group {
  @apply flex flex-col;
}

.form-group label {
  @apply text-sm text-gray-600 mb-1;
}

.form-control {
  @apply border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-color focus:border-primary-color;
}

.form-checkbox {
  @apply rounded border-gray-300 text-primary-color focus:ring-primary-color;
}

.download-button {
  @apply w-full flex items-center justify-center px-6 py-3 bg-primary-color text-white font-medium rounded-lg hover:bg-primary-color-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.loading-spinner {
  @apply w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2;
}
</style> 