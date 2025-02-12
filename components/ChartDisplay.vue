<template>
  <div class="chart-display">
    <!-- Chart Title and Controls -->
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-controls" v-if="showControls">
        <!-- Chart Type Selector -->
        <select
          v-model="selectedChartType"
          class="chart-type-select"
          @change="updateChart"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="doughnut">Doughnut Chart</option>
        </select>

        <!-- Time Period Selector -->
        <select
          v-if="showTimeSelector"
          v-model="selectedTimePeriod"
          class="time-period-select"
          @change="updateChart"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>

        <!-- Download Button -->
        <button
          v-if="allowDownload"
          class="download-button"
          @click="downloadChart"
        >
          Download
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <!-- Legend -->
    <div v-if="showLegend" class="chart-legend">
      <div
        v-for="(item, index) in legendItems"
        :key="index"
        class="legend-item"
        @click="toggleDataset(index)"
        :class="{ 'legend-item-hidden': !item.active }"
      >
        <span
          class="legend-color"
          :style="{ backgroundColor: item.color }"
        ></span>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span>Loading chart data...</span>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="retryLoad" class="retry-button">
        Retry
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue'
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js'

interface Props {
  title: string;
  data: ChartData;
  options?: ChartOptions;
  type?: string;
  showControls?: boolean;
  showTimeSelector?: boolean;
  showLegend?: boolean;
  allowDownload?: boolean;
  loading?: boolean;
  error?: string;
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'chartTypeChange', type: string): void;
  (e: 'timePeriodChange', period: string): void;
  (e: 'datasetToggle', index: number): void;
  (e: 'download'): void;
  (e: 'retry'): void;
}>()

// Refs
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chart = ref<Chart | null>(null)

// State
const selectedChartType = ref(props.type || 'line')
const selectedTimePeriod = ref('month')
const legendItems = ref<{ label: string; color: string; active: boolean }[]>([])

// Chart Configuration
const getChartConfig = (): ChartConfiguration => {
  return {
    type: selectedChartType.value,
    data: props.data,
    options: {
      ...defaultOptions,
      ...props.options
    }
  } as ChartConfiguration
}

const defaultOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
}

// Methods
const initChart = () => {
  if (!chartCanvas.value) return

  chart.value = new Chart(chartCanvas.value, getChartConfig())
  updateLegendItems()
}

const updateChart = () => {
  if (!chart.value) return

  chart.value.config.type = selectedChartType.value
  chart.value.update()

  emit('chartTypeChange', selectedChartType.value)
  if (props.showTimeSelector) {
    emit('timePeriodChange', selectedTimePeriod.value)
  }
}

const updateLegendItems = () => {
  if (!chart.value || !chart.value.data.datasets) return

  legendItems.value = chart.value.data.datasets.map((dataset, index) => ({
    label: dataset.label || `Dataset ${index + 1}`,
    color: dataset.backgroundColor as string,
    active: true
  }))
}

const toggleDataset = (index: number) => {
  if (!chart.value) return

  const dataset = chart.value.data.datasets[index]
  const legendItem = legendItems.value[index]

  dataset.hidden = !dataset.hidden
  legendItem.active = !dataset.hidden

  chart.value.update()
  emit('datasetToggle', index)
}

const downloadChart = () => {
  if (!chartCanvas.value) return

  const link = document.createElement('a')
  link.download = `${props.title.toLowerCase().replace(/\s+/g, '-')}-chart.png`
  link.href = chartCanvas.value.toDataURL('image/png')
  link.click()

  emit('download')
}

const retryLoad = () => {
  emit('retry')
}

// Lifecycle Hooks
onMounted(() => {
  initChart()
})

// Watchers
watch(() => props.data, () => {
  if (chart.value) {
    chart.value.data = props.data
    chart.value.update()
    updateLegendItems()
  }
}, { deep: true })

watch(() => props.options, () => {
  if (chart.value) {
    chart.value.options = {
      ...defaultOptions,
      ...props.options
    }
    chart.value.update()
  }
}, { deep: true })
</script>

<style scoped>
.chart-display {
  @apply bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative;
}

.chart-header {
  @apply flex justify-between items-center mb-6;
}

.chart-title {
  @apply text-xl font-semibold text-gray-900;
}

.chart-controls {
  @apply flex items-center space-x-4;
}

.chart-type-select,
.time-period-select {
  @apply px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-color focus:border-primary-color;
}

.download-button {
  @apply px-4 py-1.5 bg-primary-color text-white rounded-md hover:bg-primary-color-dark transition-colors duration-200;
}

.chart-container {
  @apply relative h-80;
}

.chart-legend {
  @apply mt-6 flex flex-wrap gap-4;
}

.legend-item {
  @apply flex items-center cursor-pointer transition-opacity duration-200;
}

.legend-item-hidden {
  @apply opacity-50;
}

.legend-color {
  @apply w-3 h-3 rounded-full mr-2;
}

.legend-label {
  @apply text-sm text-gray-700;
}

.loading-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90;
}

.spinner {
  @apply w-8 h-8 border-4 border-primary-color border-t-transparent rounded-full animate-spin mb-2;
}

.error-message {
  @apply absolute inset-0 flex flex-col items-center justify-center text-red-600 bg-white bg-opacity-90;
}

.retry-button {
  @apply mt-2 px-4 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200;
}
</style> 