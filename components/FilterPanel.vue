<template>
  <div class="filter-panel">
    <h2 class="filter-title">Filters</h2>

    <!-- Date Range -->
    <div class="filter-section">
      <h3 class="section-title">Date Range</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="startDate">From</label>
          <input
            type="month"
            id="startDate"
            v-model="filters.startDate"
            class="form-control"
            @change="emitUpdate"
          />
        </div>
        <div class="form-group">
          <label for="endDate">To</label>
          <input
            type="month"
            id="endDate"
            v-model="filters.endDate"
            class="form-control"
            @change="emitUpdate"
          />
        </div>
      </div>
    </div>

    <!-- Police Force -->
    <div class="filter-section">
      <h3 class="section-title">Police Force</h3>
      <div class="form-group">
        <select
          v-model="filters.policeForce"
          class="form-control"
          @change="emitUpdate"
        >
          <option value="">All Forces</option>
          <option
            v-for="force in policeForces"
            :key="force.id"
            :value="force.id"
          >
            {{ force.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Search Type -->
    <div class="filter-section">
      <h3 class="section-title">Search Type</h3>
      <div class="space-y-2">
        <label
          v-for="type in searchTypes"
          :key="type.value"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :value="type.value"
            v-model="filters.searchTypes"
            class="form-checkbox"
            @change="emitUpdate"
          />
          <span class="ml-2">{{ type.label }}</span>
        </label>
      </div>
    </div>

    <!-- Outcome -->
    <div class="filter-section">
      <h3 class="section-title">Outcome</h3>
      <div class="space-y-2">
        <label
          v-for="outcome in outcomes"
          :key="outcome.value"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :value="outcome.value"
            v-model="filters.outcomes"
            class="form-checkbox"
            @change="emitUpdate"
          />
          <span class="ml-2">{{ outcome.label }}</span>
        </label>
      </div>
    </div>

    <!-- Gender -->
    <div class="filter-section">
      <h3 class="section-title">Gender</h3>
      <div class="space-y-2">
        <label
          v-for="gender in genders"
          :key="gender.value"
          class="flex items-center"
        >
          <input
            type="radio"
            :value="gender.value"
            v-model="filters.gender"
            class="form-radio"
            @change="emitUpdate"
          />
          <span class="ml-2">{{ gender.label }}</span>
        </label>
      </div>
    </div>

    <!-- Age Range -->
    <div class="filter-section">
      <h3 class="section-title">Age Range</h3>
      <div class="space-y-2">
        <label
          v-for="range in ageRanges"
          :key="range.value"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :value="range.value"
            v-model="filters.ageRanges"
            class="form-checkbox"
            @change="emitUpdate"
          />
          <span class="ml-2">{{ range.label }}</span>
        </label>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="filter-actions">
      <button
        class="btn btn-primary w-full mb-2"
        @click="applyFilters"
      >
        Apply Filters
      </button>
      <button
        class="btn btn-secondary w-full"
        @click="resetFilters"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue'

interface FilterOption {
  value: string;
  label: string;
}

interface Filters {
  startDate: string;
  endDate: string;
  policeForce: string;
  searchTypes: string[];
  outcomes: string[];
  gender: string;
  ageRanges: string[];
}

const emit = defineEmits<{
  (e: 'update:filters', filters: Filters): void;
  (e: 'apply'): void;
  (e: 'reset'): void;
}>()

// Initial filter state
const filters = reactive<Filters>({
  startDate: '',
  endDate: '',
  policeForce: '',
  searchTypes: [],
  outcomes: [],
  gender: '',
  ageRanges: []
})

// Filter options
const policeForces = ref<FilterOption[]>([
  { value: 'met', label: 'Metropolitan Police' },
  { value: 'btp', label: 'British Transport Police' },
  { value: 'city', label: 'City of London Police' }
])

const searchTypes = ref<FilterOption[]>([
  { value: 'person', label: 'Person Search' },
  { value: 'vehicle', label: 'Vehicle Search' },
  { value: 'both', label: 'Person & Vehicle' }
])

const outcomes = ref<FilterOption[]>([
  { value: 'arrest', label: 'Arrest' },
  { value: 'warning', label: 'Warning' },
  { value: 'nfa', label: 'No Further Action' },
  { value: 'penalty', label: 'Penalty Notice' }
])

const genders = ref<FilterOption[]>([
  { value: '', label: 'All' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
])

const ageRanges = ref<FilterOption[]>([
  { value: 'under18', label: 'Under 18' },
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: 'over34', label: 'Over 34' }
])

// Event handlers
const emitUpdate = () => {
  emit('update:filters', filters)
}

const applyFilters = () => {
  emit('apply')
}

const resetFilters = () => {
  // Reset all filters to initial state
  filters.startDate = ''
  filters.endDate = ''
  filters.policeForce = ''
  filters.searchTypes = []
  filters.outcomes = []
  filters.gender = ''
  filters.ageRanges = []
  
  emit('reset')
  emit('update:filters', filters)
}
</script>

<style scoped>
.filter-panel {
  @apply bg-white rounded-lg shadow-sm border border-gray-100 p-6;
}

.filter-title {
  @apply text-xl font-semibold text-gray-900 mb-6;
}

.filter-section {
  @apply mb-6;
}

.section-title {
  @apply text-sm font-medium text-gray-700 mb-3;
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

.form-radio {
  @apply border-gray-300 text-primary-color focus:ring-primary-color;
}

.filter-actions {
  @apply mt-8 space-y-2;
}

.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-primary-color text-white hover:bg-primary-color-dark;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}
</style> 