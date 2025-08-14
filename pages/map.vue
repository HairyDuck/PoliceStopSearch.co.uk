<template>
  <div class="flex flex-col">
    <!-- Meta tags are handled by useHead in the script setup -->
    <div class="bg-white border-b border-gray-200 p-4 sm:p-4 p-3">
      <div class="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
        <!-- Mode Selector -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div class="flex rounded-lg shadow-sm w-full sm:w-auto">
            <button
              @click="setMode('map')"
              class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-l-lg"
              :class="mode === 'map' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              Map View
            </button>
            <button
              @click="setMode('force')"
              class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-r-lg"
              :class="mode === 'force' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              Force View
            </button>
          </div>

          <!-- Force Selector (visible in force mode) -->
          <select
            v-if="mode === 'force'"
            v-model="selectedForceId"
            class="w-full sm:w-auto form-select rounded-md border-gray-300 text-sm"
            :disabled="isLoading"
          >
            <option value="">Select Police Force</option>
            <option v-for="force in forces" :key="force.id" :value="force.id">
              {{ force.name }}
            </option>
          </select>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <!-- Month Selector -->
          <MobileDatePicker
            v-if="isMobile"
            v-model="selectedMonths"
            @change="handleDateChange"
          />
          <DatePicker
            v-else
            v-model="selectedMonths"
            @change="handleDateChange"
          />

          <!-- Location Button -->
          <button
            @click="useMyLocation"
            class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            :disabled="isLocating"
          >
            <span v-if="isLocating" class="loading-spinner mr-2"></span>
            <svg v-else class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Location
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col">
      <!-- Map and Details Container -->
      <div class="flex flex-col lg:flex-row">
        <!-- Map Section -->
        <div class="flex-1" :class="[
          'relative transition-all duration-300 border-2 border-gray-300',
          isFullscreen ? 'h-screen fixed inset-0 z-40' : 'h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px]'
        ]" style="min-height: 400px;">
          <div ref="mapContainer" class="absolute inset-0 w-full h-full map-container bg-gray-100" style="min-height: 400px;"></div>
          
          <!-- Map loading indicator -->
          <div v-if="!map" class="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div class="text-center">
              <div class="loading-spinner mx-auto mb-2"></div>
              <p class="text-gray-600">Loading map...</p>
            </div>
          </div>

          <!-- Fullscreen Toggle -->
          <button
            @click="toggleFullscreen"
            class="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 z-10 hover:bg-gray-50"
            :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
          >
            <svg
              v-if="isFullscreen"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 9L4 4m0 0l5-5M4 4l5 5M15 9l5-5m0 0l-5-5m5 5l-5 5M9 15l-5 5m0 0l5 5M4 20l5-5M15 15l5 5m0 0l-5 5m5-5l-5-5"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>

        <!-- Details Modal -->
        <div 
          v-if="selectedIncident"
          class="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center overflow-y-auto"
          @click="selectedIncident = null"
        >
          <div 
            class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col z-[9999]"
            @click.stop
          >
            <div class="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-semibold">Stop and Search Details</h2>
              <button 
                @click="selectedIncident = null"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-4">
              <StopSearchIncident :incident="selectedIncident" />
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="bg-gray-50 p-4 sm:p-6" :class="{ 'hidden': isFullscreen }">
        <div class="max-w-7xl mx-auto">
          <!-- Quick Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-2">Total Searches</h3>
              <div class="text-3xl font-bold text-primary">
                <span v-if="isLoading" class="loading-spinner"></span>
                <span v-else>{{ statsData.totalSearches }}</span>
              </div>
              <div class="text-sm text-gray-500 mt-1">In current view</div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-2">Arrests Made</h3>
              <div class="text-3xl font-bold text-primary">
                <span v-if="isLoading" class="loading-spinner"></span>
                <span v-else>{{ statsData.arrests }}</span>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ statsData.totalSearches ? ((statsData.arrests / statsData.totalSearches) * 100).toFixed(1) + '%' : '0%' }} of searches
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-2">No Further Action</h3>
              <div class="text-3xl font-bold text-primary">
                <span v-if="isLoading" class="loading-spinner"></span>
                <span v-else>{{ statsData.noFurtherAction }}</span>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ statsData.totalSearches ? ((statsData.noFurtherAction / statsData.totalSearches) * 100).toFixed(1) + '%' : '0%' }} of searches
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-2">Most Common Object</h3>
              <div class="text-xl font-bold text-primary">
                <span v-if="isLoading" class="loading-spinner"></span>
                <span v-else>{{ statsData.mostCommonObject }}</span>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ statsData.mostCommonObjectCount }} searches ({{ statsData.totalSearches ? ((statsData.mostCommonObjectCount / statsData.totalSearches) * 100).toFixed(1) + '%' : '0%' }})
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <!-- Ethnicity Analysis -->
            <div class="bg-white rounded-lg shadow p-4 sm:p-6 lg:col-span-2">
              <h3 class="text-lg font-semibold mb-4">Ethnicity Analysis</h3>
              <div class="space-y-4">
                <div v-for="(count, ethnicity) in statsData.ethnicityBreakdown" 
                     :key="ethnicity" 
                     class="bg-gray-50 p-4 rounded-lg"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex-1">
                      <span class="font-medium">{{ ethnicity }}</span>
                      <div class="flex items-center mt-1">
                        <div class="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                          <div class="bg-primary rounded-full h-2"
                               :style="{ width: `${(count / statsData.totalSearches) * 100}%` }">
                          </div>
                        </div>
                        <span class="text-sm text-gray-500 whitespace-nowrap">
                          {{ count }} ({{ ((count / statsData.totalSearches) * 100).toFixed(1) }}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 mt-2">
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span class="text-sm">
                        {{ statsData.ethnicityOutcomes[ethnicity]?.arrests || 0 }} arrests
                      </span>
                    </div>
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                      <span class="text-sm">
                        {{ statsData.ethnicityOutcomes[ethnicity]?.noAction || 0 }} no action
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gender Distribution -->
            <div class="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 class="text-lg font-semibold mb-4">Gender Distribution</h3>
              <div class="space-y-4">
                <div v-for="(count, gender) in statsData.genderBreakdown" 
                     :key="gender"
                     class="bg-gray-50 p-4 rounded-lg"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">{{ gender }}</span>
                    <span class="text-sm text-gray-500">
                      {{ count }} ({{ ((count / statsData.totalSearches) * 100).toFixed(1) }}%)
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-primary rounded-full h-2"
                      :style="{ width: `${(count / statsData.totalSearches) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Objects of Search -->
            <div class="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h3 class="text-lg font-semibold mb-4">Objects of Search</h3>
              <div class="space-y-4">
                <div v-for="(count, object) in statsData.objectsOfSearch" 
                     :key="object"
                     class="bg-gray-50 p-4 rounded-lg"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">{{ object }}</span>
                    <span class="text-sm text-gray-500">
                      {{ count }} ({{ ((count / statsData.totalSearches) * 100).toFixed(1) }}%)
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-primary rounded-full h-2"
                      :style="{ width: `${(count / statsData.totalSearches) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Outcomes -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Search Outcomes</h3>
              <div class="space-y-4">
                <div v-for="(count, outcome) in statsData.outcomes" 
                     :key="outcome"
                     class="bg-gray-50 p-4 rounded-lg"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">{{ outcome }}</span>
                    <span class="text-sm text-gray-500">
                      {{ count }} ({{ ((count / statsData.totalSearches) * 100).toFixed(1) }}%)
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-primary rounded-full h-2"
                      :style="{ width: `${(count / statsData.totalSearches) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { format, parse, subMonths, getYear, setYear } from 'date-fns'
import type { Map as LeafletMap, Marker, LatLngBounds, FeatureGroup, Layer } from 'leaflet'
import * as L from 'leaflet'
import 'leaflet.markercluster'
import { useStopSearchStore } from '../stores/stopsearch'
import type { StopSearchIncident } from '../types'
import { useNuxtApp, useHead } from 'nuxt/app'
import { Chart } from 'chart.js/auto'
import { useAnalytics } from '../composables/useAnalytics'
import { useMobile } from '../composables/useMobile'
import DatePicker from '../components/DatePicker.vue'
import MobileDatePicker from '../components/MobileDatePicker.vue'

// Initialize head metadata
useHead({
  title: 'Interactive Stop and Search Map | UK Police Data Visualization',
  meta: [
    {
      name: 'description',
      content: 'Explore UK police stop and search data through our interactive map. Filter by location, date, and demographics to analyze police activity in your area.'
    },
    {
      name: 'keywords',
      content: 'police map, stop and search map, UK police data, interactive police map, crime statistics map'
    }
  ]
})

interface Month {
  value: string
  label: string
  disabled: boolean
}

interface ForceDetails {
  description: string | null
  url: string
  engagement_methods: {
    url: string
    type: string
    description: string | null
    title: string
  }[]
  telephone: string
  id: string
  name: string
}

interface CachedArea {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  date: string;
  incidents: StopSearchIncident[];
  markers: L.Marker[];
}

// State
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const markerCluster = ref<L.MarkerClusterGroup | null>(null)
const markers = ref<L.Marker[]>([])
const cachedAreas = ref<CachedArea[]>([])
const maxCacheSize = 50 // Maximum number of areas to cache
const selectedIncident = ref<StopSearchIncident | null>(null)
const selectedMonths = ref<string[]>(['latest'])
const store = useStopSearchStore()
const forces = ref([] as { id: string; name: string }[])
const forceDetails = ref<Record<string, ForceDetails>>({})
const isLoading = ref(false)
const selectedForceId = ref<string | null>(null)
const mode = ref<'map' | 'force'>('map')
const isLocating = ref(false)
const outcomesChart = ref<HTMLCanvasElement | null>(null)
const ethnicityChart = ref<HTMLCanvasElement | null>(null)
const objectsChart = ref<HTMLCanvasElement | null>(null)
const genderChart = ref<HTMLCanvasElement | null>(null)
const ageChart = ref<HTMLCanvasElement | null>(null)
const isFullscreen = ref(false)
const chartInstances = ref<any[]>([])
const analytics = useAnalytics()
const { isMobile } = useMobile()

// Computed
const visibleIncidents = computed(() => markers.value.length)
const totalCachedIncidents = computed(() => {
  const areaCache = store.cache.area as Record<string, StopSearchIncident[]>
  return Object.values(areaCache).reduce((total: number, incidents) => 
    total + (Array.isArray(incidents) ? incidents.length : 0), 0
  )
})

const statsData = computed(() => {
  const data = {
    totalSearches: markers.value.length,
    arrests: 0,
    noFurtherAction: 0,
    outcomes: {} as Record<string, number>,
    ethnicityBreakdown: {} as Record<string, number>,
    ethnicityOutcomes: {} as Record<string, { arrests: number, noAction: number }>,
    objectsOfSearch: {} as Record<string, number>,
    genderBreakdown: {} as Record<string, number>,
    ageBreakdown: {} as Record<string, number>,
    mostCommonObject: 'None',
    mostCommonObjectCount: 0
  }

  markers.value.forEach(marker => {
    const incident = (marker as any).incident as StopSearchIncident
    if (incident) {
      // Count outcomes
      const outcome = incident.outcome || 'Not Recorded'
      data.outcomes[outcome] = (data.outcomes[outcome] || 0) + 1
      
      if (outcome.toLowerCase().includes('arrest')) {
        data.arrests++
      } else if (outcome.toLowerCase().includes('no further action')) {
        data.noFurtherAction++
      }

      // Count objects of search
      const object = incident.object_of_search || 'Not Recorded'
      data.objectsOfSearch[object] = (data.objectsOfSearch[object] || 0) + 1

      // Count ethnicities and their outcomes
      const ethnicity = incident.self_defined_ethnicity || incident.officer_defined_ethnicity || 'Not Recorded'
      data.ethnicityBreakdown[ethnicity] = (data.ethnicityBreakdown[ethnicity] || 0) + 1
      
      // Initialize ethnicity outcomes if not exists
      if (!data.ethnicityOutcomes[ethnicity]) {
        data.ethnicityOutcomes[ethnicity] = { arrests: 0, noAction: 0 }
      }
      
      // Count outcomes by ethnicity
      if (outcome.toLowerCase().includes('arrest')) {
        data.ethnicityOutcomes[ethnicity].arrests++
      } else if (outcome.toLowerCase().includes('no further action')) {
        data.ethnicityOutcomes[ethnicity].noAction++
      }

      // Count genders
      const gender = incident.gender || 'Not Recorded'
      data.genderBreakdown[gender] = (data.genderBreakdown[gender] || 0) + 1

      // Count age groups
      const age = incident.age_range || 'Not Recorded'
      data.ageBreakdown[age] = (data.ageBreakdown[age] || 0) + 1
    }
  })

  // Find most common object of search
  const objects = Object.entries(data.objectsOfSearch)
  if (objects.length > 0) {
    const [object, count] = objects.reduce((max, curr) => 
      curr[1] > max[1] ? curr : max
    )
    data.mostCommonObject = object
    data.mostCommonObjectCount = count
  }

  return data
})

// Month selector logic
const availableMonths = computed(() => {
  const months: Month[] = []
  const today = new Date()
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const twoYearsAgo = subMonths(today, 24)
  
  store.availableDatasets.forEach(dataset => {
    try {
      const date = parse(dataset.date, 'yyyy-MM', new Date())
      const value = format(date, 'yyyy-MM')
      const label = format(date, 'MMM')
      const disabled = !store.isDateAvailable(value)
      
      months.push({ value, label, disabled })
    } catch (error) {
      console.error('Error parsing date:', error)
    }
  })
  return months
})

const formatMonth = (dateString: string) => {
  if (dateString === 'latest') return 'Latest Available'
  try {
    return format(parse(dateString, 'yyyy-MM', new Date()), 'MMMM yyyy')
  } catch {
    return dateString
  }
}

const getDisabledReason = (month: { value: string; disabled: boolean }) => {
  const date = parse(month.value, 'yyyy-MM', new Date())
  const today = new Date()
  
  if (date > today) {
    return 'Future date not available'
  }
  if (date < subMonths(today, 24)) {
    return 'Data older than 24 months'
  }
  return 'No data available for this month'
}

// Cache management functions
const isAreaCached = (bounds: L.LatLngBounds, date: string) => {
  return cachedAreas.value.some(area => {
    return (
      area.date === date &&
      area.bounds.north >= bounds.getNorth() &&
      area.bounds.south <= bounds.getSouth() &&
      area.bounds.east >= bounds.getEast() &&
      area.bounds.west <= bounds.getWest()
    )
  })
}

const getCachedIncidents = (bounds: L.LatLngBounds, date: string): StopSearchIncident[] => {
  const incidents: StopSearchIncident[] = []
  
  cachedAreas.value.forEach(area => {
    if (area.date !== date) return

    if (
      area.bounds.north >= bounds.getSouth() &&
      area.bounds.south <= bounds.getNorth() &&
      area.bounds.east >= bounds.getWest() &&
      area.bounds.west <= bounds.getEast()
    ) {
      area.incidents.forEach(incident => {
        const lat = parseFloat(incident.location.latitude)
        const lng = parseFloat(incident.location.longitude)
        
        if (
          lat <= bounds.getNorth() &&
          lat >= bounds.getSouth() &&
          lng <= bounds.getEast() &&
          lng >= bounds.getWest() &&
          !incidents.some(i => 
            i.location.latitude === incident.location.latitude && 
            i.location.longitude === incident.location.longitude
          )
        ) {
          incidents.push(incident)
        }
      })
    }
  })
  
  return incidents
}

const cacheArea = (bounds: L.LatLngBounds, date: string, incidents: StopSearchIncident[], newMarkers: Marker[]) => {
  if (cachedAreas.value.length >= maxCacheSize) {
    const oldestArea = cachedAreas.value.shift()
    if (oldestArea) {
      oldestArea.markers.forEach(marker => marker.remove())
    }
  }

  cachedAreas.value.push({
    bounds: {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest()
    },
    date,
    incidents,
    markers: newMarkers
  })
}

// Add this helper function
const getPolygonFromBounds = (bounds: L.LatLngBounds) => {
  return [
    [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
    [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
    [bounds.getSouthEast().lat, bounds.getSouthEast().lng],
    [bounds.getSouthWest().lat, bounds.getSouthWest().lng]
  ]
}

// Update loadData function
const loadData = async () => {
  if (!map.value) return

  try {
    isLoading.value = true
    clearMarkers()

    let allData: StopSearchIncident[] = []
    const monthsToLoad = selectedMonths.value.length > 0 ? selectedMonths.value : ['latest']
    
    const startTime = performance.now()

    if (mode.value === 'force' && selectedForceId.value) {
      analytics.trackForceView(forces.value.find(f => f.id === selectedForceId.value)?.name || selectedForceId.value)
      
      // For force view, load all data for selected months
      for (const month of monthsToLoad) {
        const monthData = await store.getStopsByForce(
          selectedForceId.value, 
          month === 'latest' ? undefined : month
        )
        allData = allData.concat(monthData)
      }

      // Center map on force data if we have any points
      if (allData.length > 0) {
        // Filter out any incidents with invalid coordinates
        const validLocations = allData.filter(incident => 
          incident.location &&
          incident.location.latitude &&
          incident.location.longitude &&
          !isNaN(parseFloat(incident.location.latitude)) &&
          !isNaN(parseFloat(incident.location.longitude))
        ).map(incident => [
          parseFloat(incident.location.latitude),
          parseFloat(incident.location.longitude)
        ] as [number, number])

        if (validLocations.length > 0) {
          const bounds = L.latLngBounds(validLocations)
          map.value.fitBounds(bounds, {
            padding: [50, 50], // Add some padding around the bounds
            maxZoom: 13 // Limit how far it zooms in
          })
        } else {
          console.warn('No valid coordinates found in force data')
          // Default to a view of the UK
          map.value.setView([54.5, -2], 6)
        }
      } else {
        console.warn('No data returned for force')
        // Default to a view of the UK
        map.value.setView([54.5, -2], 6)
      }
    } else {
      const bounds = map.value.getBounds()
      analytics.trackMapInteraction('load_area', {
        bounds: {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        },
        zoom: map.value.getZoom()
      })
      
      // Load data for each selected month
      for (const month of monthsToLoad) {
        const monthData = await store.getStopsByViewport(
          bounds,
          month === 'latest' ? undefined : month
        )
        allData = allData.concat(monthData)
      }
    }

    // Add all markers to map
    if (allData.length > 0) {
      addMarkersToMap(allData)
    }

    // After data is loaded
    const endTime = performance.now()
    analytics.trackPerformanceMetric('data_load_time', endTime - startTime)
    analytics.trackPerformanceMetric('incidents_loaded', allData.length)

  } catch (error) {
    console.error('Error loading data:', error)
    analytics.trackError('data_load', 'Failed to load data', error instanceof Error ? error.message : 'Unknown error')
  } finally {
    isLoading.value = false
  }
}

// Helper function to split bounds into a grid
const splitBoundsIntoGrid = (bounds: L.LatLngBounds, rows: number, cols: number): L.LatLngBounds[] => {
  const cells: L.LatLngBounds[] = []
  const latStep = (bounds.getNorth() - bounds.getSouth()) / rows
  const lngStep = (bounds.getEast() - bounds.getWest()) / cols

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const south = bounds.getSouth() + (i * latStep)
      const north = bounds.getSouth() + ((i + 1) * latStep)
      const west = bounds.getWest() + (j * lngStep)
      const east = bounds.getWest() + ((j + 1) * lngStep)
      
      cells.push(L.latLngBounds(
        L.latLng(south, west),
        L.latLng(north, east)
      ))
    }
  }

  return cells
}

// Helper function to check if an area is covered by cached data
const isAreaCovered = (bounds: L.LatLngBounds, cachedAreas: CachedArea[]): boolean => {
  return cachedAreas.some(area => 
    area.bounds.north >= bounds.getNorth() &&
    area.bounds.south <= bounds.getSouth() &&
    area.bounds.east >= bounds.getEast() &&
    area.bounds.west <= bounds.getWest()
  )
}

// Helper function to get cached areas in the current view
const getCachedAreasInView = (bounds: L.LatLngBounds, date: string): CachedArea[] => {
  return cachedAreas.value.filter(area => 
    area.date === date &&
    area.bounds.north >= bounds.getSouth() &&
    area.bounds.south <= bounds.getNorth() &&
    area.bounds.east >= bounds.getWest() &&
    area.bounds.west <= bounds.getEast()
  )
}

// Helper function to create markers
const createMarkers = (incidents: StopSearchIncident[]): Marker[] => {
  const { $L } = useNuxtApp()
  const L = $L as typeof import('leaflet')

  return incidents.map(incident => {
    const marker = L.marker([
      parseFloat(incident.location.latitude),
      parseFloat(incident.location.longitude)
    ])

    marker.on('click', () => {
      selectedIncident.value = incident
    })

    ;(marker as any).incident = incident
    return marker
  })
}

// Methods
const initializeMap = async () => {
  console.log('Initializing map...')
  console.log('Map container:', mapContainer.value)
  
  if (!mapContainer.value) {
    console.error('Map container not found!')
    return
  }

  let L: typeof import('leaflet')
  
  try {
    const { $L } = useNuxtApp()
    L = $L as typeof import('leaflet')
    console.log('Leaflet from plugin:', !!L)
  } catch (error) {
    console.log('Leaflet plugin not available, trying direct import...')
    try {
      // Fallback to direct import
      const leafletModule = await import('leaflet')
      L = leafletModule.default || leafletModule
      console.log('Leaflet from direct import:', !!L)
    } catch (importError) {
      console.error('Failed to import Leaflet:', importError)
      return
    }
  }
  
  if (!L) {
    console.error('Leaflet not available')
    return
  }
  
  console.log('Leaflet available:', !!L)

  // Use mobile detection from composable
  const mobileDetected = isMobile.value
  console.log('Mobile detected:', mobileDetected)

  // Mobile-specific map options
  const mapOptions: L.MapOptions = {
    center: [51.505, -0.09],
    zoom: 13,
    zoomControl: true,
    attributionControl: true,
    // Mobile-specific options
    bounceAtZoomLimits: false, // Disable bounce on zoom limits for better mobile experience
    // Prevent zoom on double tap
    doubleClickZoom: !mobileDetected,
    // Enable touch gestures
    dragging: true,
    touchZoom: true,
    scrollWheelZoom: !mobileDetected // Disable scroll wheel zoom on mobile
  }

  console.log('Creating map with options:', mapOptions)
  map.value = L.map(mapContainer.value, mapOptions)
  console.log('Map created:', !!map.value)

  // Add tile layer with mobile-optimized options
  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    // Mobile-specific tile options
    updateWhenIdle: true,
    updateWhenZooming: false,
    keepBuffer: 2
  })
  tileLayer.addTo(map.value)
  console.log('Tile layer added')

  // Initialize marker cluster with mobile-friendly options
  try {
    markerCluster.value = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: mobileDetected ? 40 : 50, // Smaller clusters on mobile
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      // Mobile-specific cluster options
      animate: !mobileDetected, // Disable animations on mobile for better performance
      animateAddingMarkers: !mobileDetected,
      // Touch-friendly cluster options
      spiderfyDistanceMultiplier: 1.5
    })

    map.value.addLayer(markerCluster.value)
    console.log('Marker cluster added')
  } catch (clusterError) {
    console.error('Failed to initialize marker cluster:', clusterError)
    // Continue without marker clustering
    markerCluster.value = null
  }
}

const addMarkersToMap = (incidents: StopSearchIncident[]) => {
  if (!map.value || !markerCluster.value) return

  const newMarkers = incidents
    .filter(incident => 
      incident.location &&
      incident.location.latitude &&
      incident.location.longitude &&
      !isNaN(parseFloat(incident.location.latitude)) &&
      !isNaN(parseFloat(incident.location.longitude))
    )
    .map(incident => {
      const marker = L.marker([
        parseFloat(incident.location.latitude),
        parseFloat(incident.location.longitude)
      ])

      marker.on('click', () => {
        selectedIncident.value = incident
      })

      ;(marker as any).incident = incident

      return marker
    })

  if (newMarkers.length > 0) {
    markerCluster.value.addLayers(newMarkers)
    markers.value = [...markers.value, ...newMarkers]
  }

  // Update charts when markers change
  initializeCharts()
}

const clearMarkers = () => {
  if (markerCluster.value) {
    markerCluster.value.clearLayers()
  }
  markers.value = []
}

const setMode = (newMode: 'map' | 'force') => {
  mode.value = newMode
  if (newMode === 'map') {
    selectedForceId.value = ''
  }
  analytics.trackFeatureUse('map_mode', newMode)
  loadData()
}

const useMyLocation = async () => {
  if (!map.value || isLocating.value) return

  try {
    isLocating.value = true
    analytics.trackFeatureUse('location', 'request_location')
    
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    const { latitude, longitude } = position.coords
    map.value.setView([latitude, longitude], 14)
    analytics.trackFeatureUse('location', 'location_success')
    loadData()
  } catch (error) {
    console.error('Error getting location:', error)
    analytics.trackError('location', 'Failed to get user location', error instanceof Error ? error.message : 'Unknown error')
  } finally {
    isLocating.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('Component mounted')
  
  // Wait for next tick to ensure DOM is ready
  await nextTick()
  console.log('After nextTick')
  
  // Initialize map
  await initializeMap()
  
  if (map.value) {
    // Force map to recalculate size after initialization
    setTimeout(() => {
      if (map.value) {
        map.value.invalidateSize()
      }
    }, 100)

    // Only add moveend event listener in map mode
    let timeout: NodeJS.Timeout
    map.value.on('moveend', () => {
      if (mode.value === 'map') {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          loadData()
        }, 300)
      }
    })

    map.value.on('zoomend', () => {
      if (map.value) {
        analytics.trackMapInteraction('zoom', {
          zoom_level: map.value.getZoom()
        })
      }
    })

    map.value.on('dragend', () => {
      if (map.value) {
        const center = map.value.getCenter()
        analytics.trackMapInteraction('pan', {
          center: [center.lat, center.lng]
        })
      }
    })

    // Add mobile-specific event handlers
    if (isMobile.value) {
      // Handle touch events
      if (map.value) {
        map.value.on('touchstart', () => {
          // Ensure map is responsive to touch
          if (map.value) {
            map.value.invalidateSize()
          }
        })
      }

      // Handle viewport changes
      const handleViewportChange = () => {
        if (map.value) {
          setTimeout(() => {
            map.value.invalidateSize()
          }, 100)
        }
      }

      window.addEventListener('resize', handleViewportChange)
      window.addEventListener('orientationchange', handleViewportChange)

      // Cleanup event listeners on unmount
      onUnmounted(() => {
        window.removeEventListener('resize', handleViewportChange)
        window.removeEventListener('orientationchange', handleViewportChange)
      })
    }
  }

  try {
    forces.value = await store.loadForces()
  } catch (error) {
    console.error('Error loading forces:', error)
  }

  await loadData()
})

// Initialize charts
const initializeCharts = () => {
  // Destroy existing charts first
  chartInstances.value.forEach(chart => chart.destroy())
  chartInstances.value = []
  
  if (outcomesChart.value) {
    const ctx = outcomesChart.value.getContext('2d')
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statsData.value.outcomes),
          datasets: [{
            data: Object.values(statsData.value.outcomes) as number[],
            backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12
              }
            }
          }
        }
      })
      chartInstances.value.push(chart)
    }
  }

  if (objectsChart.value) {
    const ctx = objectsChart.value.getContext('2d')
    if (ctx) {
      const sortedObjects = Object.entries(statsData.value.objectsOfSearch)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5) // Top 5 objects

      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sortedObjects.map(([label]) => label),
          datasets: [{
            label: 'Number of Searches',
            data: sortedObjects.map(([,value]) => value),
            backgroundColor: '#3B82F6',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        }
      })
      chartInstances.value.push(chart)
    }
  }

  if (genderChart.value) {
    const ctx = genderChart.value.getContext('2d')
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(statsData.value.genderBreakdown),
          datasets: [{
            data: Object.values(statsData.value.genderBreakdown) as number[],
            backgroundColor: ['#3B82F6', '#EF4444', '#10B981']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12
              }
            }
          }
        }
      })
      chartInstances.value.push(chart)
    }
  }

  if (ageChart.value) {
    const ctx = ageChart.value.getContext('2d')
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(statsData.value.ageBreakdown),
          datasets: [{
            label: 'Number of Searches',
            data: Object.values(statsData.value.ageBreakdown) as number[],
            backgroundColor: '#3B82F6',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
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
                display: true
              }
            }
          }
        }
      })
      chartInstances.value.push(chart)
    }
  }

  if (ethnicityChart.value) {
    const ctx = ethnicityChart.value.getContext('2d')
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(statsData.value.ethnicityOutcomes),
          datasets: [
            {
              label: 'Arrests',
              data: Object.values(statsData.value.ethnicityOutcomes).map(o => o.arrests),
              backgroundColor: '#3B82F6',
              borderRadius: 6,
              stack: 'stack0'
            },
            {
              label: 'No Further Action',
              data: Object.values(statsData.value.ethnicityOutcomes).map(o => o.noAction),
              backgroundColor: '#EF4444',
              borderRadius: 6,
              stack: 'stack0'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
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
                display: true
              }
            }
          }
        }
      })
      chartInstances.value.push(chart)
    }
  }
}

// Update cleanup on component unmount
onUnmounted(() => {
  chartInstances.value.forEach(chart => chart.destroy())
})

// Add fullscreen toggle method
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  // Trigger map resize after transition
  setTimeout(() => {
    if (map.value) {
      map.value.invalidateSize()
    }
  }, 300)
}

// Add loading indicator to the DatePicker component
const handleDateChange = async (dates: string[]) => {
  analytics.trackFilterUse('date', dates.join(','))
  await loadData()
}

// Add watch for selectedForceId changes
watch(selectedForceId, () => {
  if (mode.value === 'force' && selectedForceId.value) {
    loadData()
  }
})
</script>

<style>
@import 'leaflet.markercluster/dist/MarkerCluster.css';
@import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
</style>

<style scoped>
.loading-spinner {
  @apply w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin;
}

.stat-item {
  @apply flex justify-between items-center;
}

.stat-label {
  @apply text-sm text-gray-500;
}

.stat-value {
  @apply font-semibold text-gray-900;
}

.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark disabled:hover:bg-primary;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  /* Ensure map container is properly sized on mobile */
  .map-container {
    width: 100% !important;
    height: 100% !important;
  }
  
  /* Make controls more touch-friendly */
  .leaflet-control-zoom a {
    min-width: 44px !important;
    min-height: 44px !important;
    font-size: 18px !important;
    line-height: 44px !important;
  }
  
  /* Improve marker clusters on mobile */
  .marker-cluster {
    min-width: 44px !important;
    min-height: 44px !important;
    font-size: 14px !important;
    line-height: 44px !important;
  }
  
  /* Ensure proper touch handling */
  .leaflet-container {
    touch-action: manipulation;
  }
  
  /* Improve modal responsiveness */
  .modal-content {
    max-width: 95vw !important;
    margin: 1rem !important;
  }
}
</style> 