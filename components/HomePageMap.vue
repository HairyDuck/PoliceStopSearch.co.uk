<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Data Display -->
    <div class="space-y-6">


      <!-- Summary Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ summary.totalForces }}</div>
          <div class="text-sm text-blue-700">Total Forces</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ summary.activeForces }}</div>
          <div class="text-sm text-green-700">Active Forces</div>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-yellow-600">{{ summary.transparencyIssues }}</div>
          <div class="text-sm text-yellow-700">Transparency Issues</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ summary.latestMonth }}</div>
          <div class="text-sm text-purple-700">Latest Data Month</div>
        </div>
      </div>
      
      <!-- Map Container -->
      <div class="relative">
        <div ref="mapContainer" class="map-container h-[500px] w-full rounded-lg border border-gray-200 bg-gray-100"></div>
        
        <!-- Map loading indicator -->
        <div v-if="!map" class="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div class="text-center">
            <div class="loading-spinner mx-auto mb-2"></div>
            <p class="text-gray-600">Loading interactive map...</p>
          </div>
        </div>
        
        <!-- Map Legend -->
        <div class="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm z-10">
          <div class="font-medium mb-2">Data Status</div>
          <div class="space-y-1">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Active ({{ summary.activeForces }})</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>Limited Data ({{ summary.limitedDataForces }})</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>No Data ({{ summary.noDataForces }})</span>
            </div>
          </div>
        </div>

        <!-- Transparency Issues Notice -->
        <div v-if="forcesWithTransparencyIssues.length > 0" class="absolute top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 max-w-xs z-10">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <h4 class="text-sm font-medium text-red-800">Transparency Issues</h4>
              <p class="text-xs text-red-700 mt-1">
                {{ forcesWithTransparencyIssues.length }} forces are not publishing stop and search data, 
                contradicting Home Office transparency initiatives.
              </p>
            </div>
          </div>
        </div>
      </div>

             <!-- Force List with Transparency Issues -->
       <div class="space-y-6">
         <!-- Forces with Data -->
         <div class="bg-green-50 rounded-lg p-4">
           <h3 class="text-lg font-semibold mb-4 text-green-800 flex items-center">
             <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
               <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
             </svg>
             Forces with Recent Data ({{ summary.activeForces + summary.limitedDataForces }})
           </h3>
                             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div
                      v-for="force in forcesWithData"
                      :key="force.id"
                      class="bg-white p-3 rounded-lg border-l-4 border-green-500"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="flex-shrink-0">
                            <img 
                              :src="force.logoUrl || `/images/forces/${force.id}.png`" 
                              :alt="`${force.name} logo`"
                              class="w-8 h-8 rounded-full object-cover border border-gray-200"
                              @error="(event) => { const target = event.target as HTMLImageElement; if (target) target.style.display = 'none'; }"
                            />
                          </div>
                          <div>
                            <div class="font-medium text-sm">{{ force.name }}</div>
                            <div class="text-xs text-gray-500">
                              Latest: {{ force.latestMonth || 'No data available' }}
                            </div>
                            <div class="text-xs text-gray-500">
                              {{ force.totalIncidents.toLocaleString() }} incidents
                            </div>
                          </div>
              </div>
                        <div 
                          class="text-xs px-2 py-1 rounded-full relative group cursor-help"
                          :class="{
                            'bg-green-100 text-green-800': force.status === 'active',
                            'bg-yellow-100 text-yellow-800': force.status === 'limited'
                          }"
                          :title="force.status === 'limited' && force.monthsWithData !== undefined && force.totalMonths !== undefined 
                            ? `${force.monthsWithData}/${force.totalMonths} months of data available${force.totalIncidents < 100 ? ' (less than 100 total incidents)' : ''}` 
                            : force.status === 'active' 
                              ? 'Active: 11+ months of data and 100+ incidents' 
                              : ''"
                        >
                          {{ force.status === 'active' ? 'Active' : 'Limited' }}
                          <!-- Tooltip for Limited status -->
                          <div 
                            v-if="force.status === 'limited' && force.monthsWithData !== undefined && force.totalMonths !== undefined"
                            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs"
                          >
                            <div class="text-center">
                              <div class="font-medium mb-1">Limited Data Status</div>
                              <div>{{ force.monthsWithData }}/{{ force.totalMonths }} months of data available</div>
                              <div v-if="force.totalIncidents < 100" class="mt-1 text-gray-300">
                                Less than 100 total incidents
                              </div>
                              <div v-else-if="force.monthsWithData < 11" class="mt-1 text-gray-300">
                                Less than 11 months of data
                              </div>
                            </div>
                            <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                              <div class="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
         <!-- Forces with Transparency Issues -->
         <div v-if="forcesWithTransparencyIssues.length > 0" class="bg-red-50 rounded-lg p-4">
           <h3 class="text-lg font-semibold mb-4 text-red-800 flex items-center">
             <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
               <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
             </svg>
             Transparency Issues - Not Reporting Data ({{ forcesWithTransparencyIssues.length }})
           </h3>
                       <div class="mb-3 p-3 bg-red-100 rounded-lg">
              <p class="text-sm text-red-800">
                These forces are not publishing stop and search data, contradicting Home Office transparency initiatives.
              </p>
            </div>
                             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div
                      v-for="force in forcesWithTransparencyIssues"
                      :key="force.id"
                      class="bg-white p-3 rounded-lg border-l-4 border-red-500"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="flex-shrink-0">
                            <img 
                              :src="force.logoUrl || `/images/forces/${force.id}.png`" 
                              :alt="`${force.name} logo`"
                              class="w-8 h-8 rounded-full object-cover border border-gray-200"
                              @error="(event) => { const target = event.target as HTMLImageElement; if (target) target.style.display = 'none'; }"
                            />
                          </div>
                          <div>
                            <div class="font-medium text-sm">{{ force.name }}</div>
                            <div class="text-xs text-red-600 font-medium">
                              No data published
                            </div>
                            <div class="text-xs text-gray-500">
                              Last known: {{ force.latestMonth || 'Unknown' }}
          </div>
        </div>
      </div>
                        <div class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          No Data
          </div>
          </div>
                    </div>
                  </div>
        </div>
      </div>
      
      <!-- Call to Action -->
      <div class="text-center bg-primary/5 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-2">Explore Detailed Data</h3>
        <p class="text-gray-600 mb-4">
          Click on any force to view detailed stop and search analytics and trends.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink to="/map" class="btn btn-primary">
            Interactive Map
          </NuxtLink>
          <NuxtLink to="/analytics" class="btn btn-outline">
            View Analytics
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import type { Map as LeafletMap } from 'leaflet'

// Types
interface ForceData {
  id: string
  name: string
  status: 'active' | 'limited' | 'none'
  latestMonth: string | null
  totalIncidents: number
  monthsWithData?: number
  totalMonths?: number
  coordinates?: [number, number]
  hasTransparencyIssues?: boolean
  logoUrl?: string
}

interface SummaryData {
  totalForces: number
  activeForces: number
  limitedDataForces: number
  noDataForces: number
  transparencyIssues: number
  latestMonth: string
}

// Props
interface Props {
  forceData?: ForceData[]
  summaryData?: SummaryData
}

const props = withDefaults(defineProps<Props>(), {
  forceData: () => [],
  summaryData: () => ({
    totalForces: 0,
    activeForces: 0,
    limitedDataForces: 0,
    noDataForces: 0,
    transparencyIssues: 0,
    latestMonth: 'Unknown'
  })
})

// State
const isLoading = ref(false)
const error = ref<string | null>(null)
const forcesList = ref<ForceData[]>(props.forceData || [])
const summary = ref<SummaryData>(props.summaryData || {
  totalForces: 0,
  activeForces: 0,
  limitedDataForces: 0,
  noDataForces: 0,
  transparencyIssues: 0,
  latestMonth: 'Unknown'
})

// Map references
const mapContainer = ref<HTMLElement | null>(null)
let map: LeafletMap | null = null

// Computed properties for force categorization
const forcesWithData = computed(() => 
  forcesList.value.filter(force => force.status === 'active' || force.status === 'limited')
)

const forcesWithTransparencyIssues = computed(() => 
  forcesList.value.filter(force => force.hasTransparencyIssues === true)
)

// Watch for prop changes and update local state
watch(() => props.forceData, (newForces) => {
  if (newForces) {
    forcesList.value = newForces
  }
}, { immediate: true })

watch(() => props.summaryData, (newSummary) => {
  if (newSummary) {
    summary.value = newSummary
  }
}, { immediate: true })


// Force coordinates (approximate centers of UK police force areas)
const forceCoordinates: Record<string, [number, number]> = {
  'avon-and-somerset': [51.4545, -2.5879],
  'bedfordshire': [52.1364, -0.4661],
  'cambridgeshire': [52.2053, 0.1218],
  'cheshire': [53.1910, -2.5879],
  'city-of-london': [51.5136, -0.0984],
  'cleveland': [54.5260, -1.2346],
  'cumbria': [54.5772, -2.7975],
  'derbyshire': [53.1333, -1.5333],
  'devon-and-cornwall': [50.3755, -4.1427],
  'dorset': [50.7488, -2.3445],
  'durham': [54.7761, -1.5733],
  'dyfed-powys': [52.1307, -4.2763],
  'essex': [51.7500, 0.5000],
  'gloucestershire': [51.8642, -2.2380],
  'greater-manchester': [53.4808, -2.2426],
  'gwent': [51.6214, -3.9436],
  'hampshire': [50.9097, -1.4044],
  'hertfordshire': [51.8098, -0.2377],
  'humberside': [53.7443, -0.3325],
  'kent': [51.2787, 0.5217],
  'lancashire': [53.7632, -2.7039],
  'leicestershire': [52.6369, -1.1398],
  'lincolnshire': [53.2307, -0.5406],
  'merseyside': [53.4084, -2.9916],
  'metropolitan': [51.5074, -0.1278],
  'norfolk': [52.6143, 0.8888],
  'north-wales': [53.1404, -3.7837],
  'north-yorkshire': [54.0000, -1.5000],
  'northamptonshire': [52.2333, -0.9000],
  'northern-ireland': [54.7877, -6.4923],
  'northumbria': [54.9783, -1.6178],
  'nottinghamshire': [53.0000, -1.0000],
  'police-scotland': [55.9533, -3.1883],
  'psni': [54.7877, -6.4923],
  'south-wales': [51.4816, -3.1791],
  'south-yorkshire': [53.3811, -1.4701],
  'staffordshire': [52.8833, -2.1333],
  'suffolk': [52.1872, 0.9708],
  'surrey': [51.2362, -0.5704],
  'sussex': [50.8225, -0.1372],
  'thames-valley': [51.4543, -0.9781],
  'warwickshire': [52.2823, -1.5849],
  'west-mercia': [52.1916, -2.2215],
  'west-midlands': [52.4862, -1.8904],
  'west-yorkshire': [53.8008, -1.5491],
  'wiltshire': [51.3498, -1.9941]
}

// Initialize map when component mounts (client-side only)
const initializeMapOnMount = async () => {
  if (process.client && forcesList.value.length > 0) {
    console.log('🖥️ Client side, initializing map...')
    await nextTick()
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      initializeMap()
    }, 100)
  }
}

// Initialize the map
const initializeMap = async () => {
  console.log('🗺️ Initializing map...')
  console.log('Map container:', mapContainer.value)
  console.log('Process client:', process.client)
  console.log('Forces list length:', forcesList.value.length)
  
  // Wait for next tick to ensure DOM is ready
  await nextTick()
  
  if (!process.client) {
    console.log('❌ Not on client side')
    return
  }
  
  if (!mapContainer.value) {
    console.log('❌ Map container not found, retrying...')
    // Try again after a short delay
    setTimeout(() => {
      initializeMap()
    }, 200)
    return
  }

  try {
    const { $L } = useNuxtApp()
    console.log('$L from Nuxt app:', $L)
    const L = $L as typeof import('leaflet')
    
    if (!L) {
      console.log('❌ Leaflet not available')
      return
    }
    
    console.log('✅ Leaflet available, creating map...')

              // Create map
          map = L.map(mapContainer.value, {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
            boxZoom: false,
            keyboard: false
          }).setView([54.5, -2], 5)
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 10
      }).addTo(map)
      
    console.log('✅ Map created and tile layer added')
    
    // Add force markers
    console.log('📍 Adding markers for', forcesList.value.length, 'forces')
    forcesList.value.forEach((force, index) => {
      if (force.coordinates) {
        const color = force.status === 'active' ? '#10B981' : 
                     force.status === 'limited' ? '#F59E0B' : '#EF4444'
        
        console.log(`📍 Adding marker ${index + 1}: ${force.name} at ${force.coordinates}`)
        
        const marker = L.circleMarker(force.coordinates, {
          radius: 8,
      fillColor: color,
          color: '#fff',
      weight: 2,
      opacity: 1,
          fillOpacity: 0.8
        })
        if (map) {
          marker.addTo(map)
        }

        // Add popup with force info
        marker.bindPopup(`
          <div class="text-sm">
            <div class="font-medium">${force.name}</div>
            <div class="text-gray-600">Status: ${force.status === 'active' ? 'Active' : force.status === 'limited' ? 'Limited Data' : 'No Data'}</div>
            <div class="text-gray-600">Latest: ${force.latestMonth || 'No data'}</div>
            ${force.totalIncidents > 0 ? `<div class="text-gray-600">Incidents: ${force.totalIncidents.toLocaleString()}</div>` : ''}
        </div>
        `)
      }
    })
    
  } catch (err) {
    console.error('Error initializing map:', err)
  }
}

// Lifecycle
onMounted(() => {
  initializeMapOnMount()
})

// Cleanup
onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.loading-spinner {
  @apply w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin;
}

.btn {
  @apply inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark;
}

.btn-outline {
  @apply border-2 border-primary text-primary hover:bg-primary hover:text-white;
}

/* Ensure map container is properly styled */
.map-container {
  min-height: 500px;
  position: relative;
  z-index: 1;
}

/* Leaflet map styles */
:global(.leaflet-container) {
  height: 100%;
  width: 100%;
}

:global(.leaflet-tile) {
  filter: none;
}
</style>
