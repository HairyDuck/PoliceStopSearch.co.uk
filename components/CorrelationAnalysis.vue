<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-xl font-semibold mb-4">Correlation Analysis</h3>
    
    <!-- Factor Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Compare Stop & Search with:</label>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          v-for="factor in correlationFactors"
          :key="factor.id"
          @click="selectedFactor = factor.id"
          :class="[
            'p-3 rounded-lg border text-sm font-medium transition-colors',
            selectedFactor === factor.id
              ? 'border-primary bg-primary text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="text-lg mb-1">{{ factor.icon }}</div>
          <div>{{ factor.name }}</div>
        </button>
      </div>
    </div>

    <!-- Correlation Chart -->
    <div class="mb-6">
      <canvas ref="correlationChart" height="300"></canvas>
    </div>

    <!-- Correlation Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="text-sm text-blue-600 font-medium">Correlation Coefficient</div>
        <div class="text-2xl font-bold text-blue-900">{{ correlationCoefficient }}</div>
        <div class="text-sm text-blue-700">{{ correlationStrength }}</div>
      </div>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="text-sm text-green-600 font-medium">R-Squared</div>
        <div class="text-2xl font-bold text-green-900">{{ rSquared }}</div>
        <div class="text-sm text-green-700">{{ rSquaredInterpretation }}</div>
      </div>
      
      <div class="bg-purple-50 p-4 rounded-lg">
        <div class="text-sm text-purple-600 font-medium">P-Value</div>
        <div class="text-2xl font-bold text-purple-900">{{ pValue }}</div>
        <div class="text-sm text-purple-700">{{ significanceLevel }}</div>
      </div>
    </div>

    <!-- Insights -->
    <div class="border-t pt-6">
      <h4 class="text-lg font-medium mb-3">Key Insights</h4>
      <div class="space-y-3">
        <div
          v-for="insight in insights"
          :key="insight.id"
          class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
        >
          <div class="text-lg">{{ insight.icon }}</div>
          <div>
            <div class="font-medium text-gray-900">{{ insight.title }}</div>
            <div class="text-sm text-gray-700">{{ insight.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistical Summary -->
    <div class="border-t pt-6 mt-6">
      <h4 class="text-lg font-medium mb-3">Statistical Summary</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5 class="font-medium text-gray-900 mb-2">Stop & Search Data</h5>
          <div class="space-y-1 text-sm text-gray-700">
            <div>Mean: {{ stopSearchStats.mean }}</div>
            <div>Median: {{ stopSearchStats.median }}</div>
            <div>Standard Deviation: {{ stopSearchStats.stdDev }}</div>
            <div>Range: {{ stopSearchStats.range }}</div>
          </div>
        </div>
        <div>
          <h5 class="font-medium text-gray-900 mb-2">{{ selectedFactorName }} Data</h5>
          <div class="space-y-1 text-sm text-gray-700">
            <div>Mean: {{ factorStats.mean }}</div>
            <div>Median: {{ factorStats.median }}</div>
            <div>Standard Deviation: {{ factorStats.stdDev }}</div>
            <div>Range: {{ factorStats.range }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const correlationChart = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const selectedFactor = ref('crime_rate')

const correlationFactors = [
  { id: 'crime_rate', name: 'Crime Rate', icon: '🚨' },
  { id: 'population', name: 'Population', icon: '👥' },
  { id: 'unemployment', name: 'Unemployment', icon: '📊' },
  { id: 'temperature', name: 'Temperature', icon: '🌡️' },
  { id: 'rainfall', name: 'Rainfall', icon: '🌧️' },
  { id: 'events', name: 'Events', icon: '🎉' },
  { id: 'holidays', name: 'Holidays', icon: '🎄' },
  { id: 'football', name: 'Football Matches', icon: '⚽' }
]

const selectedFactorName = computed(() => {
  return correlationFactors.find(f => f.id === selectedFactor.value)?.name || ''
})

// Mock correlation data
const correlationCoefficient = ref('0.73')
const correlationStrength = ref('Strong Positive')
const rSquared = ref('0.53')
const rSquaredInterpretation = ref('53% variance explained')
const pValue = ref('< 0.001')
const significanceLevel = ref('Highly Significant')

const insights = ref([
  {
    id: 1,
    icon: '📈',
    title: 'Strong Seasonal Pattern',
    description: 'Stop and search rates show a clear correlation with seasonal crime patterns.'
  },
  {
    id: 2,
    icon: '🎯',
    title: 'Predictive Value',
    description: 'This factor can help predict stop and search activity with 73% accuracy.'
  },
  {
    id: 3,
    icon: '⚠️',
    title: 'Causation vs Correlation',
    description: 'Remember: correlation does not imply causation. Further analysis needed.'
  }
])

const stopSearchStats = ref({
  mean: '2,450',
  median: '2,380',
  stdDev: '450',
  range: '1,200 - 3,800'
})

const factorStats = ref({
  mean: '85.2',
  median: '83.1',
  stdDev: '12.4',
  range: '65.0 - 105.0'
})

const createChart = () => {
  if (!correlationChart.value) return

  const ctx = correlationChart.value.getContext('2d')
  if (!ctx) return

  // Sample correlation data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Stop & Search Incidents',
        data: [2100, 1950, 2400, 2200, 2400, 2800, 2600, 2500, 2300, 2400, 2600, 2847],
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        yAxisID: 'y'
      },
      {
        label: selectedFactorName.value,
        data: [75, 72, 78, 80, 85, 90, 88, 87, 82, 79, 83, 89],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y1'
      }
    ]
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `Stop & Search vs ${selectedFactorName.value}`
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        },
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Stop & Search Incidents'
          }
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: selectedFactorName.value
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    }
  })
}

const updateChart = () => {
  if (chart) {
    chart.destroy()
  }
  createChart()
}

onMounted(() => {
  createChart()
})

watch(selectedFactor, () => {
  updateChart()
})
</script>
