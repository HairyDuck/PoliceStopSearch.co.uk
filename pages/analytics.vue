<template>
  <div class="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
    <!-- SEO Meta Tags -->
    <Head>
      <title>Advanced Analytics | UK Police Stop and Search Data Analysis</title>
      <meta name="description" content="Advanced analytics and insights for UK police stop and search data including trend analysis, correlation studies, and predictive modeling." />
      <meta name="keywords" content="police analytics, stop and search trends, predictive analytics, correlation analysis, UK police data" />
      <meta property="og:title" content="Advanced Analytics | UK Police Stop and Search Data Analysis" />
      <meta property="og:description" content="Advanced analytics and insights for UK police stop and search data including trend analysis, correlation studies, and predictive modeling." />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://policestopsearch.co.uk/analytics" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    </Head>

    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Advanced Analytics</h1>

    <!-- Force Selection -->
    <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
      <div class="flex flex-col space-y-6">
        <!-- Force Selection -->
        <div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h3 class="text-lg font-semibold">Select Police Forces</h3>
            <div class="flex items-center space-x-4">
              <button
                @click="selectAllForces = !selectAllForces; selectedForces = selectAllForces ? availableForces.map(f => f.id) : []"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {{ selectAllForces ? 'Deselect All' : 'Select All' }}
              </button>
            </div>
          </div>

          <!-- Selected Forces Tags -->
          <div v-if="selectedForces.length > 0" class="flex flex-wrap gap-2 mb-4">
            <div
              v-for="id in selectedForces"
              :key="id"
              class="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
            >
              <span class="mr-1">{{ getForceName(id) }}</span>
              <button
                @click="removeForce(id)"
                class="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Search Forces -->
          <div class="relative mb-4">
            <input
              type="text"
              v-model="forceSearch"
              placeholder="Search forces..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Forces Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 max-h-60 overflow-y-auto px-1">
            <label 
              v-for="force in filteredForces" 
              :key="force.id"
              class="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              :class="{ 'bg-blue-50 border border-blue-200': selectedForces.includes(force.id) }"
            >
              <input
                type="checkbox"
                :value="force.id"
                v-model="selectedForces"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              >
              <div class="flex items-center ml-2 min-w-0 flex-1">
                <img 
                  :src="forceLogos[force.id]?.logo_url || '/images/forces/default.png'" 
                  :alt="`${force.name} logo`"
                  class="w-6 h-6 sm:w-8 sm:h-8 object-contain mr-2 flex-shrink-0"
                  @error="handleImageError"
                >
                <div class="min-w-0 flex-1">
                  <span class="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate block">{{ force.name }}</span>
                  <span v-if="forcesWithTransparencyIssues.has(force.id)" class="text-xs text-red-600 truncate block">Not currently publishing data</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Time Period Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Analysis Period</label>
          <select
            v-model="selectedPeriod"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
            <option value="24m">Last 24 Months</option>
            <option value="all">All Available Data</option>
          </select>
        </div>

        <!-- Load Data Button -->
        <button 
          @click="loadData"
          :disabled="selectedForces.length === 0 || isLoading"
          class="w-full bg-blue-600 text-white py-4 sm:py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed touch-manipulation"
        >
          {{ isLoading ? 'Loading Data...' : 'Load Analytics Data' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-lg shadow p-6 sm:p-8 mb-8">
      <div class="text-center mb-6">
        <div class="loading-spinner mx-auto mb-4"></div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Loading Analytics Data</h3>
        <p class="text-sm sm:text-base text-gray-600">Processing {{ selectedForces.length }} force(s) across {{ getMonthsToFetch().length }} months</p>
        </div>
        
      <!-- Progress Information -->
      <div class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-blue-800">Data Processing</span>
            <span class="text-sm text-blue-600">{{ loadingProgress.current }}/{{ loadingProgress.total }}</span>
          </div>
          <div class="w-full bg-blue-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              :style="{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }"
            ></div>
          </div>
          <p class="text-xs text-blue-600 mt-2">{{ loadingProgress.currentForce }} - {{ formatMonth(loadingProgress.currentMonth) }}</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-lg font-bold text-gray-900">{{ analyticsData.length }}</div>
            <div class="text-xs text-gray-600">Data Points</div>
        </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-lg font-bold text-gray-900">{{ totalIncidents.toLocaleString() }}</div>
            <div class="text-xs text-gray-600">Total Incidents</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-lg font-bold text-gray-900">{{ forceBoundaries.length }}</div>
            <div class="text-xs text-gray-600">Boundaries Loaded</div>
          </div>
        </div>
          </div>
        </div>
        
    <!-- Data Display -->
    <div v-else-if="analyticsData.length > 0" class="space-y-8">
      <!-- Transparency Notice -->
      <div v-if="selectedForces.some(f => forcesWithTransparencyIssues.has(f))" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Transparency Notice</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>The following forces are not currently publishing their stop and search statistics:</p>
              <ul class="mt-1 list-disc list-inside">
                <li v-for="force in selectedForces.filter(f => forcesWithTransparencyIssues.has(f))" :key="force">
                  <span class="font-medium">{{ getForceName(force) }}</span>
                  <span class="text-xs ml-2">(Not currently publishing data)</span>
                </li>
              </ul>
              <p class="mt-2 text-xs">This contradicts the Home Office initiative for police transparency. Consider selecting forces that actively publish their data.</p>
          </div>
          </div>
          </div>
        </div>
        
      <!-- Missing Data Notice -->
      <div v-if="missingDataForces.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">Missing Data Notice</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>The following forces have missing data for some months in the selected time period:</p>
              <div class="mt-2 space-y-2">
                <div v-for="force in missingDataForces" :key="force.forceId" class="border-l-2 border-yellow-300 pl-3">
                  <div class="font-medium text-yellow-800">{{ force.forceName }}</div>
                  <div class="text-xs text-yellow-600 mt-1">
                    <span class="font-medium">Available:</span> {{ force.availableMonths }}/{{ force.totalMonths }} months
                    <span class="mx-2">•</span>
                                         <span class="font-medium">Missing:</span> {{ force.missingMonths.map(month => formatMonth(month)).join(', ') }}
        </div>
      </div>
    </div>
              <p class="mt-3 text-xs text-yellow-600">Try selecting a different time period or choose forces with more complete data.</p>
            </div>
            </div>
          </div>
        </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 font-medium">Total Incidents</div>
          <div class="text-xl md:text-3xl font-bold text-gray-900">{{ totalIncidents.toLocaleString() }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 font-medium">Arrest Rate</div>
          <div class="text-xl md:text-3xl font-bold text-gray-900">{{ arrestRate.toFixed(1) }}%</div>
            </div>
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 font-medium">Data Points</div>
          <div class="text-xl md:text-3xl font-bold text-gray-900">{{ analyticsData.length }}</div>
          </div>
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="text-xs md:text-sm text-gray-600 font-medium">Forces Analyzed</div>
          <div class="text-xl md:text-3xl font-bold text-gray-900">{{ selectedForces.length }}</div>
      </div>
    </div>

      <!-- Enhanced Analytics -->
      <div class="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Enhanced Analytics</h3>
        <EnhancedAnalytics :data="analyticsData" :selected-forces="selectedForces" />
      </div>

      <!-- Trend Analysis -->
      <div class="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Trend Analysis</h3>
        <TrendAnalysis :data="aggregatedTrendData" :force-id="selectedForces.join(',')" />
      </div>

      <!-- Maps Section -->
      <div class="space-y-4 sm:space-y-6">
      <!-- Heat Map -->
        <div class="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Heat Map - Incident Density</h3>
          <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Shows the density of stop and search incidents across selected police force areas</p>
        <HeatMap 
            v-if="clusteredIncidents.length > 0"
            :key="`heatmap-${clusteredIncidents.length}`"
          :incidents="clusteredIncidents" 
            :force-boundaries="forceBoundaries"
            :selected-forces="selectedForces"
        />
          <div v-else class="text-center py-8 text-gray-500">
            No location data available for heat map
          </div>
      </div>

      <!-- Choropleth Map -->
        <div class="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Choropleth Map - Force Comparison</h3>
          <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Compares incident rates and outcomes across different police forces</p>
        <ChoroplethMap 
            v-if="analyticsData.length > 0"
            :key="`choropleth-${analyticsData.length}`"
          :data="analyticsData" 
            :force-boundaries="forceBoundaries"
            :selected-forces="selectedForces"
        />
          <div v-else class="text-center py-8 text-gray-500">
            No data available for choropleth map
      </div>
    </div>
      </div>
    </div>

        <!-- No Data State -->
    <div v-else class="bg-white rounded-lg shadow p-6 sm:p-8">
      <div class="text-center mb-6">
        <div class="text-4xl sm:text-6xl mb-4">📊</div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ready for Analytics</h3>
        <p class="text-sm sm:text-base text-gray-600 mb-4">
          Select one or more police forces above and click "Load Analytics Data" to start analyzing stop and search data.
        </p>
          </div>

      <!-- Information Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div class="text-2xl mb-2">🔍</div>
          <h4 class="font-medium text-blue-900 mb-1">Comprehensive Analysis</h4>
          <p class="text-xs text-blue-700">Trend analysis, heat maps, and detailed insights across multiple forces</p>
              </div>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div class="text-2xl mb-2">📈</div>
          <h4 class="font-medium text-green-900 mb-1">Real-time Data</h4>
          <p class="text-xs text-green-700">Latest stop and search statistics from UK police forces</p>
              </div>
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div class="text-2xl mb-2">🗺️</div>
          <h4 class="font-medium text-purple-900 mb-1">Geographic Insights</h4>
          <p class="text-xs text-purple-700">Location-based analysis with heat maps and force boundaries</p>
            </div>
          </div>

      <!-- Quick Start Guide -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 mb-3">Quick Start Guide</h4>
        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-start">
            <span class="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
            <span>Choose police forces from the list above (alphabetically sorted)</span>
              </div>
          <div class="flex items-start">
            <span class="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
            <span>Select your analysis period (6, 12, or 24 months)</span>
              </div>
          <div class="flex items-start">
            <span class="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
            <span>Click "Load Analytics Data" to process and visualize the data</span>
              </div>
          <div class="flex items-start">
            <span class="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</span>
            <span>Explore trends, demographics, and geographic patterns in the results</span>
              </div>
            </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useStopSearchStore } from '@/stores/stopsearch'
import policeForceBadges from '@/police_forces.json'
import TrendAnalysis from '@/components/TrendAnalysis.vue'
import EnhancedAnalytics from '@/components/EnhancedAnalytics.vue'
import HeatMap from '@/components/HeatMap.vue'
import ChoroplethMap from '@/components/ChoroplethMap.vue'


// Initialize store
const store = useStopSearchStore()

// Reactive data
const selectedForces = ref<string[]>([])
const selectAllForces = ref(false)
const forceSearch = ref('')
const selectedPeriod = ref('12m')
const analyticsData = ref<any[]>([])
const rawIncidents = ref<any[]>([])
const forceBoundaries = ref<any[]>([])
const isLoading = ref(false)
const forceLogos = ref(policeForceBadges)

// Loading progress tracking
const loadingProgress = ref({
  current: 0,
  total: 0,
  currentForce: '',
  currentMonth: ''
})

// Available forces with data (from cache analysis) - sorted alphabetically
const availableForces = ref([
  { id: 'avon-and-somerset', name: 'Avon and Somerset Police' },
  { id: 'bedfordshire', name: 'Bedfordshire Police' },
  { id: 'cambridgeshire', name: 'Cambridgeshire Police' },
  { id: 'cheshire', name: 'Cheshire Police' },
  { id: 'city-of-london', name: 'City of London Police' },
  { id: 'cleveland', name: 'Cleveland Police' },
  { id: 'cumbria', name: 'Cumbria Police' },
  { id: 'derbyshire', name: 'Derbyshire Police' },
  { id: 'devon-and-cornwall', name: 'Devon and Cornwall Police' },
  { id: 'dorset', name: 'Dorset Police' },
  { id: 'durham', name: 'Durham Police' },
  { id: 'dyfed-powys', name: 'Dyfed-Powys Police' },
  { id: 'essex', name: 'Essex Police' },
  { id: 'gloucestershire', name: 'Gloucestershire Police' },
  { id: 'greater-manchester', name: 'Greater Manchester Police' },
  { id: 'gwent', name: 'Gwent Police' },
  { id: 'hampshire', name: 'Hampshire Police' },
  { id: 'hertfordshire', name: 'Hertfordshire Police' },
  { id: 'kent', name: 'Kent Police' },
  { id: 'lancashire', name: 'Lancashire Police' },
  { id: 'leicestershire', name: 'Leicestershire Police' },
  { id: 'merseyside', name: 'Merseyside Police' },
  { id: 'metropolitan', name: 'Metropolitan Police' },
  { id: 'norfolk', name: 'Norfolk Police' },
  { id: 'north-wales', name: 'North Wales Police' },
  { id: 'north-yorkshire', name: 'North Yorkshire Police' },
  { id: 'northamptonshire', name: 'Northamptonshire Police' },
  { id: 'northumbria', name: 'Northumbria Police' },
  { id: 'nottinghamshire', name: 'Nottinghamshire Police' },
  { id: 'south-wales', name: 'South Wales Police' },
  { id: 'south-yorkshire', name: 'South Yorkshire Police' },
  { id: 'staffordshire', name: 'Staffordshire Police' },
  { id: 'suffolk', name: 'Suffolk Police' },
  { id: 'surrey', name: 'Surrey Police' },
  { id: 'sussex', name: 'Sussex Police' },
  { id: 'thames-valley', name: 'Thames Valley Police' },
  { id: 'warwickshire', name: 'Warwickshire Police' },
  { id: 'west-mercia', name: 'West Mercia Police' },
  { id: 'west-midlands', name: 'West Midlands Police' },
  { id: 'west-yorkshire', name: 'West Yorkshire Police' },
  { id: 'wiltshire', name: 'Wiltshire Police' }
])

// Dynamic transparency detection based on cache analysis
const forcesWithTransparencyIssues = ref(new Set())

// Function to analyze cache and detect forces with no data
const analyzeForceTransparency = async () => {
  try {
    console.log('🔍 Analyzing force transparency...')
    const response = await $fetch<{forcesWithIssues: string[], analysis: any}>('https://api.policestopsearch.co.uk/transparency-analysis.php')
    
    if (response && response.forcesWithIssues) {
      forcesWithTransparencyIssues.value = new Set(response.forcesWithIssues)
      console.log(`✅ Transparency analysis complete: ${response.forcesWithIssues.length} forces with issues`)
    } else {
      forcesWithTransparencyIssues.value = new Set()
      console.log('✅ Transparency analysis complete: No forces with issues')
    }
  } catch (error) {
    console.error('❌ Error analyzing force transparency:', error)
    forcesWithTransparencyIssues.value = new Set()
  }
}

// Available months with data
const availableMonths = [
  '2025-07', '2025-06', '2025-05', '2025-04', '2025-03', '2025-02', '2025-01',
  '2024-12', '2024-11', '2024-10', '2024-09', '2024-08'
]

// Computed properties
const filteredForces = computed(() => {
  if (!forceSearch.value) return availableForces.value
  return availableForces.value.filter(force => 
    force.name.toLowerCase().includes(forceSearch.value.toLowerCase())
  )
})

const totalIncidents = computed(() => {
  return analyticsData.value.reduce((sum, item) => sum + (item.incidents || 0), 0)
})

const arrestRate = computed(() => {
  if (totalIncidents.value === 0) return 0
  const totalArrests = analyticsData.value.reduce((sum, item) => sum + (item.arrests || 0), 0)
  return (totalArrests / totalIncidents.value) * 100
})

const missingDataForces = computed(() => {
  if (selectedForces.value.length === 0) return []
  
  const monthsToFetch = getMonthsToFetch()
  const missingForces = []
  
  selectedForces.value.forEach(forceId => {
    const forceName = getForceName(forceId)
    const forceData = analyticsData.value.filter(data => data.force_id === forceId)
    const availableMonths = new Set(forceData.map(data => data.month))
    const missingMonths = monthsToFetch.filter(month => !availableMonths.has(month))
    
    if (missingMonths.length > 0) {
      missingForces.push({
        forceId,
        forceName,
        missingMonths,
        totalMonths: monthsToFetch.length,
        availableMonths: forceData.length
      })
    }
  })
  
  return missingForces
})

const aggregatedTrendData = computed(() => {
  if (analyticsData.value.length === 0) return []
  
  // Group data by month and sum incidents across all forces
  const monthlyData = {}
  
  analyticsData.value.forEach(item => {
    const month = item.month
    if (!monthlyData[month]) {
      monthlyData[month] = {
        month: month,
        incidents: 0,
        arrests: 0,
        noAction: 0,
        warnings: 0,
        other_outcomes: 0
      }
    }
    
    monthlyData[month].incidents += item.incidents || 0
    monthlyData[month].arrests += item.arrests || 0
    monthlyData[month].noAction += item.noAction || 0
    monthlyData[month].warnings += item.warnings || 0
    monthlyData[month].other_outcomes += item.other_outcomes || 0
  })
  
  // Convert to array and sort by month
  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))
})

// Clustering function for incidents
const clusterIncidents = (incidents: any[], maxClusters: number = 100) => {
  if (incidents.length <= maxClusters) return incidents

  // Sort incidents by count (highest first) to prioritize important locations
  const sortedIncidents = [...incidents].sort((a, b) => (b.count || 1) - (a.count || 1))
  
  // Keep the top incidents (most incidents)
  const topIncidents = sortedIncidents.slice(0, Math.floor(maxClusters * 0.7))
  
  // Cluster the remaining incidents by proximity
  const remainingIncidents = sortedIncidents.slice(Math.floor(maxClusters * 0.7))
  const clusters: any[] = []
  
  remainingIncidents.forEach(incident => {
    const lat = incident.lat
    const lng = incident.lng
    
    if (!lat || !lng) return
    
    // Find the closest existing cluster
    let closestCluster = null
    let minDistance = Infinity
    
    clusters.forEach(cluster => {
      const distance = Math.sqrt(
        Math.pow(lat - cluster.lat, 2) + Math.pow(lng - cluster.lng, 2)
      )
      if (distance < minDistance && distance < 0.1) { // 0.1 degrees ≈ 11km
        minDistance = distance
        closestCluster = cluster
      }
    })
    
    if (closestCluster) {
      // Add to existing cluster
      closestCluster.count += incident.count || 1
      closestCluster.incidents.push(incident)
    } else {
      // Create new cluster
      clusters.push({
        lat,
        lng,
        count: incident.count || 1,
        incidents: [incident],
        forceId: incident.forceId,
        forceName: incident.forceName,
        outcome: 'Clustered'
              })
            }
          })
  
  // Combine top incidents with clusters
  return [...topIncidents, ...clusters]
}

// Clustered incidents for heat map
const clusteredIncidents = computed(() => {
  if (rawIncidents.value.length === 0) return []
  
  // Determine max clusters based on data size
  let maxClusters = 100
  if (rawIncidents.value.length > 1000) maxClusters = 50
  if (rawIncidents.value.length > 5000) maxClusters = 25
  
  return clusterIncidents(rawIncidents.value, maxClusters)
})

// Methods
const getForceName = (forceId: string) => {
  const force = availableForces.value.find(f => f.id === forceId)
  return force ? force.name : forceId
}

const formatMonth = (monthString: string) => {
  if (!monthString || monthString.length !== 7) return monthString
  
  const [year, month] = monthString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  
  return date.toLocaleDateString('en-GB', { 
    month: 'long', 
    year: 'numeric' 
  })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/images/forces/default.png'
}

const removeForce = (forceId: string) => {
  const index = selectedForces.value.indexOf(forceId)
  if (index > -1) {
    selectedForces.value.splice(index, 1)
  }
}

const getMonthsToFetch = () => {
    const monthsToFetch = selectedPeriod.value === '6m' ? 6 : 
                         selectedPeriod.value === '12m' ? 12 : 
                       selectedPeriod.value === '24m' ? 24 : availableMonths.length
  
  return availableMonths.slice(0, monthsToFetch)
}

const loadForceBoundaries = async () => {
  try {
    console.log('🗺️ Loading force boundaries...')
    
    // Load boundaries for selected forces
    const boundaries = []
    for (const forceId of selectedForces.value) {
      try {
        // Try to load boundary data from public folder
        const boundaryData = await $fetch(`/data/simplified/${forceId}.geojson`)
        boundaries.push({
          forceId,
          forceName: getForceName(forceId),
          boundary: boundaryData
        })
        console.log(`✅ Loaded boundary for ${forceId}`)
  } catch (error) {
        console.log(`⚠️ No boundary data for ${forceId}, using default`)
        // Use a default boundary centered on the UK
        boundaries.push({
          forceId,
          forceName: getForceName(forceId),
          boundary: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[[-2, 51], [2, 51], [2, 53], [-2, 53], [-2, 51]]]
            },
            properties: { name: getForceName(forceId) }
          }
        })
      }
    }
    
    forceBoundaries.value = boundaries
    console.log(`🗺️ Loaded ${boundaries.length} force boundaries`)
  } catch (error) {
    console.error('❌ Error loading force boundaries:', error)
    forceBoundaries.value = []
  }
}

const loadData = async () => {
  if (selectedForces.value.length === 0) return

  isLoading.value = true
    analyticsData.value = []
    rawIncidents.value = []
  forceBoundaries.value = []
    
    // Initialize progress tracking
  const monthsToLoad = getMonthsToFetch()
  const totalRequests = selectedForces.value.length * monthsToLoad.length
    loadingProgress.value = {
      current: 0,
      total: totalRequests,
    currentForce: '',
    currentMonth: ''
  }

  try {
    console.log('🔄 Loading data for forces:', selectedForces.value)
    
    // Initialize store if needed
    if (!store._initialized) {
      console.log('🔄 Initializing store...')
      await store.initializeFromStorage()
      console.log('✅ Store initialized')
    }

    // Load force boundaries
    await loadForceBoundaries()

    console.log('📅 Loading months:', monthsToLoad)

    const allData: any[] = []
    const allIncidents: any[] = []

    // Load data for each force and month
    for (const forceId of selectedForces.value) {
      for (const month of monthsToLoad) {
        try {
          // Update progress
          loadingProgress.value.currentForce = getForceName(forceId)
          loadingProgress.value.currentMonth = month
          loadingProgress.value.current++
          
          console.log(`📊 Loading ${forceId}:${month}`)
          const data = await store.fetchForceData(forceId, month)
          
          if (data && data.total > 0) {
            // Add to analytics data
            allData.push({
            force_id: forceId,
              force_name: getForceName(forceId),
            month: month,
              incidents: data.total || 0,
              arrests: data.arrests || 0,
              noAction: data.noAction || 0,
              warnings: data.warnings || 0,
              other_outcomes: data.other || 0,
              by_ethnicity: data.byEthnicity || {},
              by_gender: data.byGender || {},
              by_age_range: data.byAgeRange || {},
              by_legislation: data.byLegislation || {},
              by_object_of_search: data.byObjectOfSearch || {},
              by_type: data.byType || {},
              by_hour: data.byHour || {},
              by_day_of_week: data.byDayOfWeek || {},
              locations: data.locations || []
            })

            // Add location data for maps (will be clustered later)
            if (data.locations && data.locations.length > 0) {
              data.locations.forEach((location: any) => {
                allIncidents.push({
                  lat: location.lat,
                  lng: location.lng,
                  forceId: forceId,
                  forceName: getForceName(forceId),
                  outcome: 'Aggregated',
                  count: location.count,
                  month: month
                })
              })
            }

            console.log(`✅ Loaded ${data.total} incidents for ${forceId}:${month}`)
          } else {
            console.log(`⚠️ No data for ${forceId}:${month}`)
          }
            } catch (error) {
          console.error(`❌ Error loading ${forceId}:${month}:`, error)
        }
      }
    }

    analyticsData.value = allData
    rawIncidents.value = allIncidents

    console.log(`✅ Loaded ${allData.length} data points with ${allIncidents.length} location points`)
    console.log('📊 Analytics data:', analyticsData.value)
    console.log('🗺️ Raw incidents for maps:', rawIncidents.value.slice(0, 5))
    console.log('🗺️ Clustered incidents for heat map:', clusteredIncidents.value.length, 'points (from', rawIncidents.value.length, 'raw)')
    console.log('🗺️ Force boundaries:', forceBoundaries.value.length)
    console.log('🗺️ Force boundaries details:', forceBoundaries.value.map(b => ({ forceId: b.forceId, hasGeometry: !!b.boundary?.geometry })))
    
    // Trigger map updates after data is loaded
    await nextTick()
    console.log('🗺️ Data loaded, maps should update automatically')
    
  } catch (error) {
    console.error('❌ Error loading analytics data:', error)
  } finally {
    isLoading.value = false
  }
}



// Lifecycle
onMounted(async () => {
  try {
    // Initialize store
    if (!store._initialized) {
      await store.initializeFromStorage()
    }
    // Analyze force transparency
    await analyzeForceTransparency()
    console.log('✅ Analytics page initialized')
  } catch (error) {
    console.error('❌ Error initializing analytics page:', error)
  }
})
</script>

<style scoped>
.loading-spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin;
}
</style>
