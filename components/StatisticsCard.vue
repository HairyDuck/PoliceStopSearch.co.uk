<template>
  <div class="statistics-card">
    <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
    </div>

    <div class="card-content">
      <!-- Primary Statistic -->
      <div class="primary-stat">
        <span class="stat-value">{{ formatValue(primaryValue) }}</span>
        <span v-if="primaryLabel" class="stat-label">{{ primaryLabel }}</span>
      </div>

      <!-- Change Indicator -->
      <div v-if="showChange" class="change-indicator" :class="getChangeClass()">
        <span class="change-arrow">
          {{ changeValue > 0 ? '↑' : '↓' }}
        </span>
        <span class="change-value">
          {{ Math.abs(changeValue) }}%
        </span>
        <span class="change-period">vs {{ changePeriod }}</span>
      </div>

      <!-- Secondary Statistics -->
      <div v-if="secondaryStats" class="secondary-stats">
        <div
          v-for="(stat, index) in secondaryStats"
          :key="index"
          class="secondary-stat"
        >
          <span class="secondary-value">{{ formatValue(stat.value) }}</span>
          <span class="secondary-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="footer" class="card-footer">
      {{ footer }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

interface SecondaryStat {
  value: number;
  label: string;
}

const props = defineProps<{
  title: string;
  subtitle?: string;
  primaryValue: number;
  primaryLabel?: string;
  changeValue?: number;
  changePeriod?: string;
  secondaryStats?: SecondaryStat[];
  footer?: string;
}>()

// Computed property to determine if change indicator should be shown
const showChange = computed(() => {
  return typeof props.changeValue !== 'undefined' && typeof props.changePeriod !== 'undefined'
})

// Format numerical values
const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toString()
}

// Get CSS class for change indicator
const getChangeClass = (): string => {
  if (!props.changeValue) return ''
  return props.changeValue > 0 ? 'positive' : 'negative'
}
</script>

<style scoped>
.statistics-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-100 p-6;
}

.card-header {
  @apply mb-6;
}

.card-title {
  @apply text-lg font-semibold text-gray-900;
}

.card-subtitle {
  @apply text-sm text-gray-500 mt-1;
}

.primary-stat {
  @apply flex flex-col mb-4;
}

.stat-value {
  @apply text-3xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-500 mt-1;
}

.change-indicator {
  @apply inline-flex items-center text-sm font-medium mb-4;
}

.change-indicator.positive {
  @apply text-green-600;
}

.change-indicator.negative {
  @apply text-red-600;
}

.change-arrow {
  @apply mr-1;
}

.change-period {
  @apply text-gray-500 ml-1;
}

.secondary-stats {
  @apply grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100;
}

.secondary-stat {
  @apply flex flex-col;
}

.secondary-value {
  @apply text-lg font-semibold text-gray-900;
}

.secondary-label {
  @apply text-sm text-gray-500 mt-1;
}

.card-footer {
  @apply mt-4 pt-4 text-sm text-gray-500 border-t border-gray-100;
}
</style> 