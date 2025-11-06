<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-xl font-semibold mb-4">Choropleth Map</h3>
    
    <!-- Single Force Message -->
    <div v-if="!hasMultipleForces" class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
      <div class="text-blue-600 mb-2">
        <svg class="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <h4 class="text-lg font-medium text-blue-900 mb-2">Select Multiple Forces</h4>
      <p class="text-blue-700 mb-3">
        The Choropleth Map compares data across different police forces. 
        Please select 2 or more forces to see meaningful comparisons.
      </p>
      <div class="text-sm text-blue-600">
        <p>• Compare incident rates between forces</p>
        <p>• View arrest rates and outcomes</p>
        <p>• Identify patterns across different areas</p>
      </div>
    </div>
    
    <!-- Map Controls (only show when multiple forces selected) -->
    <div v-if="hasMultipleForces" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <!-- Geographic Level -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Geographic Level</label>
          <select
            v-model="geographicLevel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="force">Police Force</option>
            <option value="region">Region</option>
            <option value="county">County</option>
            <option value="borough">Borough</option>
            <option value="ward">Ward</option>
            <option value="neighborhood">Neighborhood</option>
          </select>
        </div>
        
        <!-- Metric Selection -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Metric
            <button 
              class="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 transition-colors relative"
              @mouseenter="showMetricTooltip = true"
              @mouseleave="showMetricTooltip = false"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              <div 
                v-show="showMetricTooltip"
                class="absolute z-50 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none"
                style="bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px;"
              >
                <div class="font-medium mb-2">Metric Definitions</div>
                <div class="space-y-2">
                  <div><strong>Total Incidents:</strong> Raw count of stop and search incidents</div>
                  <div><strong>Incidents per Capita:</strong> Incidents per 100,000 population (estimated)</div>
                  <div><strong>Incidents per km²:</strong> Incidents per 1,000 square kilometers (estimated)</div>
                  <div><strong>Arrest Rate:</strong> Percentage of incidents resulting in arrest</div>
                  <div><strong>Positive Outcome Rate:</strong> Percentage of incidents with any positive outcome</div>
                </div>
                <!-- Arrow pointing down -->
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </button>
          </label>
          <select
            v-model="selectedMetric"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="total_incidents">Total Incidents</option>
            <option value="incidents_per_capita">Incidents per Capita</option>
            <option value="incidents_per_km2">Incidents per km²</option>
            <option value="arrest_rate">Arrest Rate</option>
            <option value="positive_outcome_rate">Positive Outcome Rate</option>
          </select>
        </div>
      </div>
    </div>



    <!-- Statistics Summary (only show when multiple forces selected) -->
    <div v-if="hasMultipleForces" class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="bg-blue-50 p-3 md:p-4 rounded-lg relative">
        <div class="text-xs md:text-sm text-blue-600 font-medium">
          Highest Rate
          <button 
            class="inline-flex items-center justify-center w-3 h-3 md:w-4 md:h-4 ml-1 text-blue-400 hover:text-blue-600 transition-colors relative"
            @mouseenter="showHighestTooltip = true"
            @mouseleave="showHighestTooltip = false"
          >
            <svg class="w-2 h-2 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <div 
              v-show="showHighestTooltip"
              class="absolute z-50 w-48 md:w-64 p-2 md:p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none"
              style="bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px;"
            >
              <div class="font-medium mb-1">Highest Rate Calculation</div>
              <p>Shows the police force with the maximum value for {{ selectedMetricLabel.toLowerCase() }}.</p>
              <p class="mt-1"><strong>Formula:</strong> Max({{ selectedMetricLabel.toLowerCase() }} across all selected forces)</p>
              <p class="mt-1"><strong>Current:</strong> {{ highestRateExact }} {{ metricUnit }} in {{ highestRateArea }}</p>
              <!-- Arrow pointing down -->
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        </div>
        <div class="text-lg md:text-2xl font-bold text-blue-900" :title="highestRateExact">{{ highestRate }}</div>
        <div class="text-xs md:text-sm text-blue-700">{{ highestRateArea }}</div>
      </div>
      
      <div class="bg-green-50 p-4 rounded-lg relative">
        <div class="text-sm text-green-600 font-medium">
          Lowest Rate
          <button 
            class="inline-flex items-center justify-center w-4 h-4 ml-1 text-green-400 hover:text-green-600 transition-colors relative"
            @mouseenter="showLowestTooltip = true"
            @mouseleave="showLowestTooltip = false"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <div 
              v-show="showLowestTooltip"
              class="absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none"
              style="bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px;"
            >
              <div class="font-medium mb-1">Lowest Rate Calculation</div>
              <p>Shows the police force with the minimum value for {{ selectedMetricLabel.toLowerCase() }}.</p>
              <p class="mt-1"><strong>Formula:</strong> Min({{ selectedMetricLabel.toLowerCase() }} across all selected forces)</p>
              <p class="mt-1"><strong>Current:</strong> {{ lowestRateExact }} {{ metricUnit }} in {{ lowestRateArea }}</p>
              <!-- Arrow pointing down -->
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        </div>
        <div class="text-2xl font-bold text-green-900" :title="lowestRateExact">{{ lowestRate }}</div>
        <div class="text-sm text-green-700">{{ lowestRateArea }}</div>
      </div>
      
      <div class="bg-purple-50 p-4 rounded-lg relative">
        <div class="text-sm text-purple-600 font-medium">
          Average Rate
          <button 
            class="inline-flex items-center justify-center w-4 h-4 ml-1 text-purple-400 hover:text-purple-600 transition-colors relative"
            @mouseenter="showAverageTooltip = true"
            @mouseleave="showAverageTooltip = false"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <div 
              v-show="showAverageTooltip"
              class="absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none"
              style="bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px;"
            >
              <div class="font-medium mb-1">Average Rate Calculation</div>
              <p>Shows the mean value for {{ selectedMetricLabel.toLowerCase() }} across all selected forces.</p>
              <p class="mt-1"><strong>Formula:</strong> Sum({{ selectedMetricLabel.toLowerCase() }}) ÷ Number of forces</p>
              <p class="mt-1"><strong>Current:</strong> {{ averageRateExact }} {{ metricUnit }} across {{ processedData.length }} forces</p>
              <!-- Arrow pointing down -->
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        </div>
        <div class="text-2xl font-bold text-purple-900" :title="averageRateExact">{{ averageRate }}</div>
        <div class="text-sm text-purple-700">Across all areas</div>
      </div>
      
      <div class="bg-orange-50 p-4 rounded-lg relative">
        <div class="text-sm text-orange-600 font-medium">
          Variation
          <button 
            class="inline-flex items-center justify-center w-4 h-4 ml-1 text-orange-400 hover:text-orange-600 transition-colors relative"
            @mouseenter="showVariationTooltip = true"
            @mouseleave="showVariationTooltip = false"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <div 
              v-show="showVariationTooltip"
              class="absolute z-50 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none"
              style="bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px;"
            >
              <div class="font-medium mb-1">Variation Coefficient Calculation</div>
              <p>Measures how much {{ selectedMetricLabel.toLowerCase() }} varies between forces.</p>
              <p class="mt-1"><strong>Formula:</strong> Standard Deviation ÷ Mean</p>
              <p class="mt-1"><strong>Interpretation:</strong></p>
              <ul class="mt-1 ml-2">
                <li>• &lt; 0.15: Low variation</li>
                <li>• 0.15 - 0.35: Moderate variation</li>
                <li>• &gt; 0.35: High variation</li>
              </ul>
              <p class="mt-1"><strong>Current:</strong> {{ variationCoefficientExact }} ({{ variationCoefficient < 0.15 ? 'Low' : variationCoefficient < 0.35 ? 'Moderate' : 'High' }} variation)</p>
              <!-- Arrow pointing down -->
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        </div>
        <div class="text-2xl font-bold text-orange-900" :title="variationCoefficientExact">{{ variationCoefficient }}</div>
        <div class="text-sm text-orange-700">Coefficient of variation</div>
      </div>
    </div>

    <!-- Geographic Level Info -->
    <div v-if="hasMultipleForces && geographicLevel !== 'force'" class="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
      <div class="flex items-center">
        <div class="text-amber-600 mr-2">⚠️</div>
        <div class="text-sm text-amber-800">
          Currently showing Police Force level data. Other geographic levels are not yet available.
        </div>
      </div>
    </div>

    <!-- Map Container (only show when multiple forces selected) -->
    <div v-if="hasMultipleForces" class="relative">
      <!-- Map Legend -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">{{ selectedMetricLabel }}</span>
          <span class="text-sm text-gray-600">{{ maxValue }} {{ metricUnit }}</span>
        </div>
        <div class="h-6 rounded-lg" :style="{ background: selectedColorSchemeGradient }"></div>
        <div class="flex justify-between text-xs text-gray-600 mt-1">
          <span>{{ minValue }} {{ metricUnit }}</span>
          <span>{{ maxValue }} {{ metricUnit }}</span>
        </div>
      </div>
      
      <div ref="choroplethContainer" class="w-full h-80 bg-gray-100 rounded-lg relative">
        <div v-if="!hasData" class="absolute inset-0 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <div class="text-4xl mb-2">🗺️</div>
            <div>No data available for choropleth map</div>
            <div class="text-sm text-gray-400">Select forces to view geographic distribution</div>
          </div>
        </div>
        <div v-else-if="isLoading" class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="loading-spinner mb-2"></div>
            <div>Loading choropleth map...</div>
          </div>
        </div>
        
        <!-- Map Controls Overlay -->
        <div v-if="hasData && !isLoading" class="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <button
            @click="resetView"
            class="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
            title="Reset View"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button
            @click="toggleFullscreen"
            class="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
            :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="isFullscreen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Area Details (only show when multiple forces selected) -->
    <div v-if="hasMultipleForces && selectedArea" class="mt-6 border-t pt-6">
      <h4 class="text-lg font-medium mb-3">Force Details: {{ selectedArea.name }}</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 font-medium">Total Incidents</div>
          <div class="text-xl font-bold text-gray-900">{{ selectedArea.total_incidents?.toLocaleString() }}</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 font-medium">Arrest Rate</div>
                        <div class="text-xl font-bold text-gray-900">{{ Math.round(selectedArea.arrest_rate || 0) }}%</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 font-medium">Positive Outcomes</div>
                        <div class="text-xl font-bold text-gray-900">{{ Math.round(selectedArea.positive_outcome_rate || 0) }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  data: any[]
  mapBounds?: any
  forceBoundaries?: any[]
  selectedForces?: string[]
}>()

// Tooltip states - declare these first to avoid render issues
const showHighestTooltip = ref(false)
const showLowestTooltip = ref(false)
const showAverageTooltip = ref(false)
const showVariationTooltip = ref(false)
const showMetricTooltip = ref(false)

const geographicLevel = ref('force')
const selectedMetric = ref('total_incidents')
const selectedColorScheme = ref('viridis')
const isFullscreen = ref(false)
const selectedArea = ref(null)
const isLoading = ref(false)
const hasData = ref(false)

// Check if multiple forces are selected for meaningful comparison
const hasMultipleForces = computed(() => {
  if (!props.data || props.data.length === 0) return false
  
  // Count unique forces in the data
  const uniqueForces = new Set()
  props.data.forEach(month => {
    if (month.force_id) {
      uniqueForces.add(month.force_id)
    }
  })
  
  return uniqueForces.size > 1
})

// Fixed color scheme (Viridis only)
const selectedColorSchemeGradient = 'linear-gradient(to right, #440154, #31688e, #35b779, #fde725)'

// Helper function to format numbers (e.g., 12349 -> 12k)
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return Math.round(num).toString()
}

const selectedMetricLabel = computed(() => {
  const labels = {
    total_incidents: 'Total Incidents',
    incidents_per_capita: 'Incidents per Capita',
    incidents_per_km2: 'Incidents per km²',
    arrest_rate: 'Arrest Rate',
    positive_outcome_rate: 'Positive Outcome Rate'
  }
  return labels[selectedMetric.value] || 'Metric'
})

const metricUnit = computed(() => {
  const units = {
    total_incidents: 'incidents',
    incidents_per_capita: 'per 1,000 people',
    incidents_per_km2: 'per km²',
    arrest_rate: '%',
    positive_outcome_rate: '%'
  }
  return units[selectedMetric.value] || ''
})

// Real statistics computed from actual data - show individual force data
const processedData = computed(() => {
  if (!props.data || props.data.length === 0) return []
  
  // Group data by force to create individual force statistics
  const forceData = {}
  
  props.data.forEach(month => {
    const forceId = month.force_id || 'unknown'
    if (!forceData[forceId]) {
      forceData[forceId] = {
        force_id: forceId,
        force_name: month.force_name || 'Unknown Force',
        total_incidents: 0,
        arrests: 0,
        noAction: 0,
        no_action: 0
      }
    }
    
    forceData[forceId].total_incidents += month.incidents || 0
    forceData[forceId].arrests += month.arrests || 0
            forceData[forceId].noAction += month.noAction || 0
    forceData[forceId].no_action += month.no_action || 0
  })
  
  // Convert to array and calculate rates
  return Object.values(forceData).map(force => ({
    ...force,
    arrest_rate: force.total_incidents > 0 ? (force.arrests / force.total_incidents * 100) : 0,
            positive_outcome_rate: force.total_incidents > 0 ? (force.noAction / force.total_incidents * 100) : 0,
    incidents_per_capita: Math.round((force.total_incidents / 100000) * 100) / 100, // Per 100k people
    incidents_per_km2: Math.round((force.total_incidents / 1000) * 100) / 100 // Per 1000 km²
  }))
})

const highestRate = computed(() => {
  if (!processedData.value.length) return '0'
  const max = Math.max(...processedData.value.map(d => d[selectedMetric.value] || 0))
  return formatNumber(max)
})

const highestRateExact = computed(() => {
  if (!processedData.value.length) return '0'
  const max = Math.max(...processedData.value.map(d => d[selectedMetric.value] || 0))
  return Math.round(max).toString()
})

const highestRateArea = computed(() => {
  if (!processedData.value.length) return 'N/A'
  const max = Math.max(...processedData.value.map(d => d[selectedMetric.value] || 0))
  const area = processedData.value.find(d => (d[selectedMetric.value] || 0) === max)
  return area ? area.force_name : 'N/A'
})

const lowestRate = computed(() => {
  if (!processedData.value.length) return '0'
  const min = Math.min(...processedData.value.map(d => d[selectedMetric.value] || 0))
  return formatNumber(min)
})

const lowestRateExact = computed(() => {
  if (!processedData.value.length) return '0'
  const min = Math.min(...processedData.value.map(d => d[selectedMetric.value] || 0))
  return Math.round(min).toString()
})

const lowestRateArea = computed(() => {
  if (!processedData.value.length) return 'N/A'
  const min = Math.min(...processedData.value.map(d => d[selectedMetric.value] || 0))
  const area = processedData.value.find(d => (d[selectedMetric.value] || 0) === min)
  return area ? area.force_name : 'N/A'
})

const averageRate = computed(() => {
  if (!processedData.value.length) return '0'
  const avg = processedData.value.reduce((sum, d) => sum + (d[selectedMetric.value] || 0), 0) / processedData.value.length
  return formatNumber(avg)
})

const averageRateExact = computed(() => {
  if (!processedData.value.length) return '0'
  const avg = processedData.value.reduce((sum, d) => sum + (d[selectedMetric.value] || 0), 0) / processedData.value.length
  return Math.round(avg).toString()
})

const variationCoefficient = computed(() => {
  if (!processedData.value.length) return '0'
  const values = processedData.value.map(d => d[selectedMetric.value] || 0)
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)
  return mean > 0 ? Math.round((stdDev / mean) * 100) / 100 : '0'
})

const variationCoefficientExact = computed(() => {
  if (!processedData.value.length) return '0'
  const values = processedData.value.map(d => d[selectedMetric.value] || 0)
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)
  return mean > 0 ? Math.round((stdDev / mean) * 10000) / 10000 : '0'
})

const maxValue = computed(() => {
  if (!processedData.value.length) return '0'
  return Math.round(Math.max(...processedData.value.map(d => d[selectedMetric.value] || 0))).toString()
})

const minValue = computed(() => {
  if (!processedData.value.length) return '0'
  return Math.round(Math.min(...processedData.value.map(d => d[selectedMetric.value] || 0))).toString()
})

const choroplethContainer = ref<HTMLDivElement>()
let map: any = null
let geoJsonLayer: any = null

// UK Police Force boundaries (comprehensive)
const ukPoliceForces = {
  'avon-and-somerset': { name: 'Avon and Somerset Police', center: [51.4545, -2.5879] },
  'bedfordshire': { name: 'Bedfordshire Police', center: [52.1364, -0.4661] },
  'cambridgeshire': { name: 'Cambridgeshire Police', center: [52.2053, 0.1218] },
  'cheshire': { name: 'Cheshire Police', center: [53.1910, -2.5879] },
  'city-of-london': { name: 'City of London Police', center: [51.5136, -0.0984] },
  'cleveland': { name: 'Cleveland Police', center: [54.5260, -1.2346] },
  'cumbria': { name: 'Cumbria Police', center: [54.5772, -2.7975] },
  'derbyshire': { name: 'Derbyshire Police', center: [53.1333, -1.5333] },
  'devon-and-cornwall': { name: 'Devon and Cornwall Police', center: [50.7184, -3.5339] },
  'dorset': { name: 'Dorset Police', center: [50.7488, -1.7689] },
  'durham': { name: 'Durham Police', center: [54.7761, -1.5733] },
  'dyfed-powys': { name: 'Dyfed-Powys Police', center: [52.1307, -3.7837] },
  'essex': { name: 'Essex Police', center: [51.7355, 0.4698] },
  'gloucestershire': { name: 'Gloucestershire Police', center: [51.8642, -2.2380] },
  'greater-manchester': { name: 'Greater Manchester Police', center: [53.4808, -2.2426] },
  'gwent': { name: 'Gwent Police', center: [51.6214, -3.9436] },
  'hampshire': { name: 'Hampshire Police', center: [51.0237, -1.3422] },
  'hertfordshire': { name: 'Hertfordshire Police', center: [51.8098, -0.2377] },
  'humberside': { name: 'Humberside Police', center: [53.7443, -0.3325] },
  'kent': { name: 'Kent Police', center: [51.2787, 0.5217] },
  'lancashire': { name: 'Lancashire Police', center: [53.7632, -2.7039] },
  'leicestershire': { name: 'Leicestershire Police', center: [52.6369, -1.1398] },
  'lincolnshire': { name: 'Lincolnshire Police', center: [53.2307, -0.5406] },
  'merseyside': { name: 'Merseyside Police', center: [53.4084, -2.9916] },
  'metropolitan': { name: 'Metropolitan Police', center: [51.5074, -0.1278] },
  'norfolk': { name: 'Norfolk Police', center: [52.6143, 0.8888] },
  'north-wales': { name: 'North Wales Police', center: [53.1404, -3.2759] },
  'north-yorkshire': { name: 'North Yorkshire Police', center: [54.0000, -1.5000] },
  'northamptonshire': { name: 'Northamptonshire Police', center: [52.2347, -0.8976] },
  'northern-ireland': { name: 'Police Service of Northern Ireland', center: [54.7877, -6.4923] },
  'northumbria': { name: 'Northumbria Police', center: [54.9783, -1.6178] },
  'nottinghamshire': { name: 'Nottinghamshire Police', center: [52.9548, -1.1581] },
  'south-wales': { name: 'South Wales Police', center: [51.4816, -3.1791] },
  'south-yorkshire': { name: 'South Yorkshire Police', center: [53.3811, -1.4701] },
  'staffordshire': { name: 'Staffordshire Police', center: [52.8793, -2.0574] },
  'suffolk': { name: 'Suffolk Police', center: [52.1872, 0.9708] },
  'sussex': { name: 'Sussex Police', center: [50.8225, -0.1372] },
  'surrey': { name: 'Surrey Police', center: [51.2362, -0.5704] },
  'thames-valley': { name: 'Thames Valley Police', center: [51.4543, -0.9781] },
  'warwickshire': { name: 'Warwickshire Police', center: [52.2823, -1.5849] },
  'west-mercia': { name: 'West Mercia Police', center: [52.1916, -2.2215] },
  'west-midlands': { name: 'West Midlands Police', center: [52.4862, -1.8904] },
  'west-yorkshire': { name: 'West Yorkshire Police', center: [53.8008, -1.5491] },
  'wiltshire': { name: 'Wiltshire Police', center: [51.3498, -1.9941] }
}

const initializeMap = () => {
  if (!choroplethContainer.value || process.server) return
  
  // Import Leaflet dynamically
  import('leaflet').then((L) => {
    // Clear existing map
    if (map) {
      map.remove()
    }
    
    // Wait for container to be fully rendered
    nextTick(() => {
      if (!choroplethContainer.value) {
        console.warn('ChoroplethMap: Container not available after nextTick')
        return
      }
      
      // Initialize map
      map = L.map(choroplethContainer.value, {
        preferCanvas: true
      }).setView([54.5, -2], 6)
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map)
      
      // Wait a bit for map to render before updating choropleth
      setTimeout(() => {
        updateChoropleth()
      }, 100)
    })
  }).catch(error => {
    console.error('Error loading Leaflet:', error)
    isLoading.value = false
  })
}

const updateChoropleth = () => {
  if (!map || !props.data) return
  
  console.log('ChoroplethMap: Updating with', props.data.length, 'data points')
  console.log('ChoroplethMap: Sample data:', props.data.slice(0, 2))
  
  isLoading.value = true
  
  if (props.data.length === 0) {
    hasData.value = false
    isLoading.value = false
    return
  }
  
  hasData.value = true
  
  // Remove existing layer
  if (geoJsonLayer) {
    map.removeLayer(geoJsonLayer)
  }
  
  // Always try to load ALL force boundaries from file to show complete UK map
  const loadBoundaries = () => {
    console.log('ChoroplethMap: Loading all UK force boundaries from file')
    // Always load from the complete UK boundaries file to show all forces
    return fetch('/data/uk-police-forces.geojson')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load UK force boundaries')
        }
        return response.json()
      })
      .catch(error => {
        console.error('ChoroplethMap: Failed to load UK boundaries, using force boundaries from props:', error)
        // Fallback to props if file loading fails
        if (props.forceBoundaries && props.forceBoundaries.length > 0) {
          const combinedGeoJSON = {
            type: 'FeatureCollection',
            features: props.forceBoundaries.map(boundary => ({
              type: 'Feature',
              geometry: boundary.boundary.geometry,
              properties: {
                force_id: boundary.forceId,
                force_name: boundary.forceName
              }
            }))
          }
          return Promise.resolve(combinedGeoJSON)
        } else {
          throw error
        }
      })
  }
  
  loadBoundaries().then(geojson => {
    console.log('ChoroplethMap: Loaded boundaries:', geojson.features?.length || 0, 'features')
    
    // Validate GeoJSON structure
    if (!geojson.features || geojson.features.length === 0) {
      console.error('ChoroplethMap: No features in GeoJSON')
      isLoading.value = false
      return
    }
    
    // Log first feature for debugging
    console.log('ChoroplethMap: First feature:', geojson.features[0])
    
    const values = processedData.value.map(d => d[selectedMetric.value] || 0)
    const maxVal = Math.max(...values)
    const minVal = Math.min(...values)
    
    // Create a map of force data for quick lookup
    const forceDataMap = {}
    processedData.value.forEach(data => {
      forceDataMap[data.force_id] = data
    })
    
    console.log('ChoroplethMap: Force data map:', Object.keys(forceDataMap))
    console.log('ChoroplethMap: Processed data:', processedData.value)
    
    // Style function for the GeoJSON
    const style = (feature) => {
      const forceId = feature.properties.force_id
      const forceData = forceDataMap[forceId]
      const isSelected = props.selectedForces?.includes(forceId) || false
      
      if (!forceData || !isSelected) {
        // Show unselected or no-data forces in gray
        return {
          fillColor: '#e5e7eb',
          weight: 1,
          opacity: 0.7,
          color: '#9ca3af',
          fillOpacity: 0.3
        }
      }
      
      // Color selected forces based on their data
      const value = forceData[selectedMetric.value] || 0
      const normalizedValue = maxVal > minVal ? (value - minVal) / (maxVal - minVal) : 0.5
      const color = getColorForValue(normalizedValue)
      
      return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: '#333',
        fillOpacity: 0.8
      }
    }
    
    // Create GeoJSON layer with error handling
    try {
      geoJsonLayer = L.geoJSON(geojson, {
        style: style,
        onEachFeature: (feature, layer) => {
          const forceId = feature.properties.force_id
          const forceData = forceDataMap[forceId]
          const forceName = feature.properties.force_name || forceId
          const isSelected = props.selectedForces?.includes(forceId) || false
          
          if (forceData && isSelected) {
            // Show detailed data for selected forces with data
            const value = forceData[selectedMetric.value] || 0
            
            layer.bindPopup(`
              <div class="text-center p-2">
                <h3 class="font-bold text-lg mb-2">${forceData.force_name}</h3>
                <div class="space-y-1 text-sm">
                  <p><strong>${selectedMetricLabel.value}:</strong> ${Math.round(value)} ${metricUnit.value}</p>
                  <p><strong>Total Incidents:</strong> ${forceData.total_incidents.toLocaleString()}</p>
                  <p><strong>Arrest Rate:</strong> ${Math.round(forceData.arrest_rate)}%</p>
                  <p><strong>Positive Outcomes:</strong> ${Math.round(forceData.positive_outcome_rate)}%</p>
                </div>
              </div>
            `)
            
            layer.on('click', () => {
              selectedArea.value = {
                name: forceData.force_name,
                total_incidents: forceData.total_incidents,
                arrest_rate: forceData.arrest_rate,
                positive_outcome_rate: forceData.positive_outcome_rate
              }
            })
          } else {
            // Show basic info for unselected forces or forces with no data
            layer.bindPopup(`
              <div class="text-center p-2">
                <h3 class="font-bold text-lg mb-2">${forceName}</h3>
                <div class="space-y-1 text-sm text-gray-600">
                  ${isSelected 
                    ? '<p>Selected but no data available for this time period</p>' 
                    : '<p>Not selected for analysis</p>'}
                  <p class="text-xs">Select this force in the analytics panel to view data</p>
                </div>
              </div>
            `)
          }
        }
      }).addTo(map)
      
      // Fit map to bounds - only if we have valid bounds
      if (geoJsonLayer.getBounds) {
        const bounds = geoJsonLayer.getBounds()
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] })
        } else {
          // Fallback to UK view if bounds are invalid
          map.setView([54.5, -2], 6)
        }
      } else {
        // Fallback to UK view if no bounds available
        map.setView([54.5, -2], 6)
      }
      
      isLoading.value = false
    } catch (error) {
      console.error('ChoroplethMap: Error creating GeoJSON layer:', error)
      
      // Fallback: Create simple circle markers for each force
      console.log('ChoroplethMap: Creating fallback circle markers...')
      const fallbackLayer = L.layerGroup()
      
      processedData.value.forEach(forceData => {
        // Use approximate center coordinates for each force
        const centers = {
          'essex': [51.7355, 0.4698],
          'cambridgeshire': [52.2053, 0.1218],
          'greater-manchester': [53.4808, -2.2426],
          'bedfordshire': [52.1364, -0.4661]
        }
        
        const center = centers[forceData.force_id] || [54.5, -2]
        const value = forceData[selectedMetric.value] || 0
        const normalizedValue = maxVal > minVal ? (value - minVal) / (maxVal - minVal) : 0.5
        const color = getColorForValue(normalizedValue)
        
        const circle = L.circle(center, {
          radius: 50000, // 50km radius
          fillColor: color,
          color: '#333',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        })
        
        circle.bindPopup(`
          <div class="text-center p-2">
            <h3 class="font-bold text-lg mb-2">${forceData.force_name}</h3>
            <div class="space-y-1 text-sm">
              <p><strong>${selectedMetricLabel.value}:</strong> ${Math.round(value)} ${metricUnit.value}</p>
              <p><strong>Total Incidents:</strong> ${forceData.total_incidents.toLocaleString()}</p>
              <p><strong>Arrest Rate:</strong> ${Math.round(forceData.arrest_rate)}%</p>
            </div>
          </div>
        `)
        
        fallbackLayer.addLayer(circle)
      })
      
      geoJsonLayer = fallbackLayer
      geoJsonLayer.addTo(map)
      map.setView([54.5, -2], 6)
      
      isLoading.value = false
    }
  })
  .catch(error => {
    console.error('Error loading force boundaries:', error)
    isLoading.value = false
  })
}

const getColorForValue = (normalizedValue: number) => {
  const schemes = {
    viridis: ['#440154', '#31688e', '#35b779', '#fde725'],
    plasma: ['#0d0887', '#7e03a8', '#cc4778', '#f89441'],
    inferno: ['#000004', '#1b0c41', '#4a0c6b', '#781c6d'],
    rdylbu: ['#d73027', '#f46d43', '#fdae61', '#fee08b']
  }
  
  const scheme = schemes[selectedColorScheme.value] || schemes.viridis
  
  // Interpolate between colors for more granular coloring
  const colorIndex = normalizedValue * (scheme.length - 1)
  const lowerIndex = Math.floor(colorIndex)
  const upperIndex = Math.min(lowerIndex + 1, scheme.length - 1)
  const fraction = colorIndex - lowerIndex
  
  const lowerColor = scheme[lowerIndex]
  const upperColor = scheme[upperIndex]
  
  // Simple linear interpolation between colors
  if (fraction === 0) {
    return lowerColor
  }
  
  // Convert hex to RGB for interpolation
  const lowerRGB = hexToRgb(lowerColor)
  const upperRGB = hexToRgb(upperColor)
  
  const interpolatedRGB = {
    r: Math.round(lowerRGB.r + (upperRGB.r - lowerRGB.r) * fraction),
    g: Math.round(lowerRGB.g + (upperRGB.g - lowerRGB.g) * fraction),
    b: Math.round(lowerRGB.b + (upperRGB.b - lowerRGB.b) * fraction)
  }
  
  return rgbToHex(interpolatedRGB)
}

// Helper functions for color interpolation
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

const rgbToHex = (rgb: { r: number, g: number, b: number }) => {
  return '#' + [rgb.r, rgb.g, rgb.b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

const resetView = () => {
  if (map) {
    map.setView([54.5, -2], 6)
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  // In a real implementation, you would toggle fullscreen mode
  console.log('Toggling fullscreen:', isFullscreen.value)
}

// Watch for changes and update choropleth
watch([geographicLevel, selectedMetric, selectedColorScheme, () => props.data, () => props.forceBoundaries], () => {
  if (map) {
    updateChoropleth()
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  nextTick(() => {
    initializeMap()
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

// Expose methods for parent components
defineExpose({
  updateChoropleth,
  getChoroplethConfig: () => ({
    geographicLevel: geographicLevel.value,
    metric: selectedMetric.value,
    colorScheme: selectedColorScheme.value
  })
})
</script>

<style scoped>
.loading-spinner {
  @apply w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin;
}
</style>
