<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-xl font-semibold mb-4">Trend Analysis</h3>

    <!-- Trend Chart -->
    <div class="mb-6">
      <canvas ref="trendChart" height="300"></canvas>
    </div>

    <!-- Trend Insights -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="text-sm text-blue-600 font-medium">Trend Direction</div>
        <div class="text-2xl font-bold text-blue-900">{{ trendDirection }}</div>
        <div class="text-sm text-blue-700">{{ trendPercentage }}% change</div>
      </div>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="text-sm text-green-600 font-medium">Peak Month</div>
        <div class="text-2xl font-bold text-green-900">{{ peakMonth }}</div>
        <div class="text-sm text-green-700">{{ peakValue }} incidents</div>
      </div>
      
      <div class="bg-purple-50 p-4 rounded-lg">
        <div class="text-sm text-purple-600 font-medium">Seasonal Pattern</div>
        <div class="text-2xl font-bold text-purple-900">{{ seasonalPattern }}</div>
        <div class="text-sm text-purple-700">{{ seasonalStrength }}</div>
      </div>
    </div>

    <!-- Anomaly Detection -->
    <div v-if="anomalies.length > 0" class="mb-6">
      <h4 class="text-lg font-medium mb-3">Anomaly Detection</h4>
      <div class="space-y-2">
        <div
          v-for="anomaly in anomalies"
          :key="anomaly.month"
          class="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div>
            <div class="font-medium text-red-900">{{ anomaly.month }}</div>
            <div class="text-sm text-red-700">{{ anomaly.description }}</div>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold text-red-900">{{ anomaly.value }}</div>
            <div class="text-sm text-red-700">{{ anomaly.deviation }}% from average</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Predictive Analytics -->
    <div class="border-t pt-6">
      <h4 class="text-lg font-medium mb-3">Predictive Analytics</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 font-medium">Next Month Forecast</div>
          <div class="text-2xl font-bold text-gray-900">{{ nextMonthForecast }}</div>
          <div class="text-sm text-gray-700">±{{ forecastConfidence }}% confidence</div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 font-medium">Trend Prediction</div>
          <div class="text-2xl font-bold text-gray-900">{{ trendPrediction }}</div>
          <div class="text-sm text-gray-700">Based on {{ dataPoints }} data points</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  data: any[]
  forceId?: string
}>()

const trendChart = ref<HTMLCanvasElement>()
let chart: Chart | null = null

// Helper function to calculate trend line
const calculateTrendLine = (data: any[]) => {
  if (data.length < 2) return data.map(() => 0)
  
  const n = data.length
  const xValues = Array.from({ length: n }, (_, i) => i)
  const yValues = data.map(item => item.incidents || 0)
  
  // Calculate linear regression
  const sumX = xValues.reduce((sum, x) => sum + x, 0)
  const sumY = yValues.reduce((sum, y) => sum + y, 0)
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0)
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  return xValues.map(x => slope * x + intercept)
}

// Computed properties based on real data
const trendDirection = computed(() => {
  if (!props.data || props.data.length < 2) return 'Insufficient Data'
  
  const firstHalf = props.data.slice(0, Math.floor(props.data.length / 2))
  const secondHalf = props.data.slice(Math.floor(props.data.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, item) => sum + (item.incidents || 0), 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, item) => sum + (item.incidents || 0), 0) / secondHalf.length
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100
  
  if (change > 5) return 'Increasing'
  if (change < -5) return 'Decreasing'
  return 'Stable'
})

const trendPercentage = computed(() => {
  if (!props.data || props.data.length < 2) return '0'
  
  const firstHalf = props.data.slice(0, Math.floor(props.data.length / 2))
  const secondHalf = props.data.slice(Math.floor(props.data.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, item) => sum + (item.incidents || 0), 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, item) => sum + (item.incidents || 0), 0) / secondHalf.length
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100
  return change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1)
})

const peakMonth = computed(() => {
  if (!props.data || props.data.length === 0) return 'No Data'
  
  const peak = props.data.reduce((max, item) => 
    (item.incidents || 0) > (max.incidents || 0) ? item : max
  )
  
  return formatMonth(peak.month)
})

const peakValue = computed(() => {
  if (!props.data || props.data.length === 0) return '0'
  
  const peak = props.data.reduce((max, item) => 
    (item.incidents || 0) > (max.incidents || 0) ? item : max
  )
  
  return (peak.incidents || 0).toLocaleString()
})

const seasonalPattern = computed(() => {
  if (!props.data || props.data.length < 6) return 'Insufficient Data'
  
  // Simple seasonal analysis - check if summer months (Jun-Aug) have higher incidents
  const summerMonths = props.data.filter(item => {
    const month = new Date(item.month + '-01').getMonth()
    return month >= 5 && month <= 7 // June, July, August
  })
  
  const otherMonths = props.data.filter(item => {
    const month = new Date(item.month + '-01').getMonth()
    return month < 5 || month > 7
  })
  
  const summerAvg = summerMonths.reduce((sum, item) => sum + (item.incidents || 0), 0) / summerMonths.length
  const otherAvg = otherMonths.reduce((sum, item) => sum + (item.incidents || 0), 0) / otherMonths.length
  
  if (summerAvg > otherAvg * 1.1) return 'Summer Peak'
  if (summerAvg < otherAvg * 0.9) return 'Winter Peak'
  return 'No Clear Pattern'
})

const seasonalStrength = computed(() => {
  if (!props.data || props.data.length < 6) return 'Weak'
  
  const summerMonths = props.data.filter(item => {
    const month = new Date(item.month + '-01').getMonth()
    return month >= 5 && month <= 7
  })
  
  const otherMonths = props.data.filter(item => {
    const month = new Date(item.month + '-01').getMonth()
    return month < 5 || month > 7
  })
  
  const summerAvg = summerMonths.reduce((sum, item) => sum + (item.incidents || 0), 0) / summerMonths.length
  const otherAvg = otherMonths.reduce((sum, item) => sum + (item.incidents || 0), 0) / otherMonths.length
  
  const difference = Math.abs(summerAvg - otherAvg) / otherAvg
  
  if (difference > 0.3) return 'Strong'
  if (difference > 0.15) return 'Moderate'
  return 'Weak'
})

const anomalies = computed(() => {
  if (!props.data || props.data.length < 3) return []
  
  const values = props.data.map(item => item.incidents || 0)
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length)
  
  return props.data
    .filter(item => {
      const deviation = Math.abs((item.incidents || 0) - mean) / stdDev
      return deviation > 2 // More than 2 standard deviations
    })
    .map(item => ({
      month: formatMonth(item.month),
      description: `${item.incidents || 0} incidents (${((item.incidents || 0) - mean) > 0 ? 'above' : 'below'} average)`,
      value: (item.incidents || 0).toLocaleString(),
      deviation: (((item.incidents || 0) - mean) / mean * 100).toFixed(0)
    }))
})

const nextMonthForecast = computed(() => {
  if (!props.data || props.data.length < 3) return 'Insufficient Data'
  
  // Simple linear trend forecast
  const recentData = props.data.slice(-3)
  const trend = recentData.reduce((sum, item, index) => sum + (item.incidents || 0) * (index + 1), 0) / recentData.reduce((sum, _, index) => sum + (index + 1), 0)
  
  return Math.round(trend).toLocaleString()
})

const forecastConfidence = computed(() => {
  if (!props.data || props.data.length < 3) return '0'
  
  const values = props.data.map(item => item.incidents || 0)
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)
  
  // Confidence based on coefficient of variation
  const cv = stdDev / mean
  return Math.max(5, Math.min(20, (cv * 100).toFixed(1)))
})

const trendPrediction = computed(() => {
  if (!props.data || props.data.length < 2) return 'Insufficient Data'
  
  const firstHalf = props.data.slice(0, Math.floor(props.data.length / 2))
  const secondHalf = props.data.slice(Math.floor(props.data.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, item) => sum + (item.incidents || 0), 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, item) => sum + (item.incidents || 0), 0) / secondHalf.length
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100
  
  if (change > 10) return 'Strong Growth'
  if (change > 5) return 'Moderate Growth'
  if (change > -5) return 'Stable'
  if (change > -10) return 'Moderate Decline'
  return 'Strong Decline'
})

const dataPoints = computed(() => {
  return props.data ? props.data.length.toString() : '0'
})

const formatMonth = (monthString: string) => {
  if (!monthString) return 'N/A'
  
  if (monthString.includes('-') && monthString.length === 7) {
    return new Date(monthString + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  }
  
  return monthString
}

const createChart = () => {
  if (!trendChart.value) return

  const ctx = trendChart.value.getContext('2d')
  if (!ctx) return

  // Use real data from props
  const chartData = {
    labels: props.data ? props.data.map(item => formatMonth(item.month)) : [],
    datasets: [
      {
        label: 'Stop and Search Incidents',
        data: props.data ? props.data.map(item => item.incidents || 0) : [],
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  // Add trend line if we have enough data
  if (props.data && props.data.length >= 2) {
    const trendData = calculateTrendLine(props.data)
    chartData.datasets.push({
      label: 'Trend Line',
      data: trendData,
      borderColor: '#ef4444',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      tension: 0.1,
      fill: false
    })
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Stop and Search Trends'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Incidents'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Month'
          }
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

watch(() => props.data, () => {
  updateChart()
}, { deep: true })
</script>
