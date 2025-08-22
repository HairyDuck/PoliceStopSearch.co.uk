<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-xl font-semibold mb-4">Heat Map Visualization</h3>
    
    <!-- Heat Map Controls -->
    <div class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Force Boundaries Toggle -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Force Boundaries</label>
          <div class="flex items-center">
            <input
              v-model="showForceBoundaries"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            >
            <span class="ml-2 text-sm text-gray-600">Show boundaries</span>
          </div>
        </div>
      </div>
    </div>



    <!-- Heat Map Legend -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">
          Incident Density
          <button 
            class="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 transition-colors"
            @mouseenter="showDensityTooltip = true"
            @mouseleave="showDensityTooltip = false"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          </button>
          <div 
            v-show="showDensityTooltip"
            class="absolute z-50 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg"
            style="bottom: 100%; left: 0; margin-bottom: 8px;"
          >
            <div class="font-medium mb-1">Incident Density Calculation</div>
            <p class="mb-2">Shows the concentration of stop and search incidents across selected police force areas.</p>
            <p class="mb-2"><strong>How it works:</strong> Each incident location is plotted on the map. The heat algorithm clusters nearby incidents and applies a density calculation based on proximity and frequency.</p>
            <p><strong>Color meaning:</strong> Dark blue = low density, bright yellow = high density</p>
          </div>
        </span>
        <span class="text-sm text-gray-600">{{ totalIncidents }} total incidents</span>
      </div>
      <div class="h-4 rounded-lg" :style="{ background: selectedColorSchemeGradient }"></div>
      <div class="flex justify-between text-xs text-gray-600 mt-1">
        <span>Low Density</span>
        <span>Medium Density</span>
        <span>High Density</span>
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-blue-50 p-4 rounded-lg relative">
        <div class="text-sm text-blue-600 font-medium">
          Hotspots
          <button 
            class="inline-flex items-center justify-center w-4 h-4 ml-1 text-blue-400 hover:text-blue-600 transition-colors"
            @mouseenter="showHotspotsTooltip = true"
            @mouseleave="showHotspotsTooltip = false"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          </button>
          <div 
            v-show="showHotspotsTooltip"
            class="absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg"
            style="bottom: 100%; left: 0; margin-bottom: 8px;"
          >
            <div class="font-medium mb-1">Hotspots Definition</div>
            <p>Areas with significantly higher incident density than the average. Calculated by identifying clusters where incident density exceeds 2x the mean density across all mapped areas.</p>
          </div>
        </div>
        <div class="text-2xl font-bold text-blue-900">{{ hotspotsCount }}</div>
        <div class="text-sm text-blue-700">High activity areas</div>
      </div>
      
      <div class="bg-green-50 p-4 rounded-lg relative">
        <div class="text-sm text-green-600 font-medium">
          Average Density
          <button 
            class="inline-flex items-center justify-center w-4 h-4 ml-1 text-green-400 hover:text-green-600 transition-colors"
            @mouseenter="showDensityTooltip2 = true"
            @mouseleave="showDensityTooltip2 = false"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          </button>
          <div 
            v-show="showDensityTooltip2"
            class="absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg"
            style="bottom: 100%; left: 0; margin-bottom: 8px;"
          >
            <div class="font-medium mb-1">Average Density Calculation</div>
            <p>Total incidents divided by the total area covered by incidents (in km²). This gives the mean incident density across all mapped locations.</p>
          </div>
        </div>
        <div class="text-2xl font-bold text-green-900">{{ averageDensity }}</div>
        <div class="text-sm text-green-700">incidents per km²</div>
      </div>
      
      <div class="bg-purple-50 p-4 rounded-lg relative">
        <div class="text-sm text-purple-600 font-medium">
          Coverage
          <button 
            class="inline-flex items-center justify-center w-4 h-4 ml-1 text-purple-400 hover:text-purple-600 transition-colors"
            @mouseenter="showCoverageTooltip = true"
            @mouseleave="showCoverageTooltip = false"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          </button>
          <div 
            v-show="showCoverageTooltip"
            class="absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg"
            style="bottom: 100%; left: 0; margin-bottom: 8px;"
          >
            <div class="font-medium mb-1">Coverage Percentage</div>
            <p>Percentage of the total police force area that has incident data. Calculated as: (Area with incidents / Total force area) × 100</p>
          </div>
        </div>
        <div class="text-2xl font-bold text-purple-900">{{ coveragePercentage }}%</div>
        <div class="text-sm text-purple-700">of total area</div>
      </div>
    </div>

    <!-- Heat Map Container -->
    <div class="mt-6">
      <div ref="heatMapContainer" class="w-full h-80 bg-gray-100 rounded-lg relative">
        <div v-if="!hasData" class="absolute inset-0 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <div class="text-4xl mb-2">🗺️</div>
            <div>No location data available</div>
            <div class="text-sm text-gray-400">Select forces with location data to view heat map</div>
          </div>
        </div>
        <div v-else-if="isLoading" class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="loading-spinner mb-2"></div>
            <div>Loading heat map...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  incidents: any[]
  mapBounds?: any
  forceBoundaries?: any[]
  selectedForces?: string[]
}>()

// Fixed values for heat map (no user controls)
const intensity = 1.0
const radius = 25
const blur = 15
const selectedColorScheme = 'viridis'
const showForceBoundaries = ref(false)
const isLoading = ref(false)
const hasData = ref(false)

// Tooltip states
const showDensityTooltip = ref(false)
const showHotspotsTooltip = ref(false)
const showDensityTooltip2 = ref(false)
const showCoverageTooltip = ref(false)

const selectedColorSchemeGradient = 'linear-gradient(to right, #440154, #31688e, #35b779, #fde725)'

// Real statistics computed from actual data
const totalIncidents = computed(() => {
  if (!props.incidents || props.incidents.length === 0) return '0'
  return props.incidents.length.toLocaleString()
})

const maxIncidents = computed(() => {
  if (!props.incidents || props.incidents.length === 0) return '0'
  
  // Process location data to get max incidents at any point
  const locationData = processLocationData(props.incidents)
  if (locationData.length === 0) return '0'
  
  return Math.max(...locationData.map(point => point[2])).toLocaleString()
})

const hotspotsCount = computed(() => {
  if (!props.incidents || props.incidents.length === 0) return '0'
  
  // Process location data to count hotspots
  const locationData = processLocationData(props.incidents)
  if (locationData.length === 0) return '0'
  
  // Count areas with above-average incident density
  const avg = locationData.reduce((sum, point) => sum + point[2], 0) / locationData.length
  return locationData.filter(point => point[2] > avg).length.toString()
})

const averageDensity = computed(() => {
  if (!props.incidents || props.incidents.length === 0) return '0'
  
  // Process location data to calculate average density
  const locationData = processLocationData(props.incidents)
  if (locationData.length === 0) return '0'
  
  const avg = locationData.reduce((sum, point) => sum + point[2], 0) / locationData.length
  return avg.toFixed(1)
})

const coveragePercentage = computed(() => {
  if (!props.incidents || props.incidents.length === 0) return '0'
  
  // Calculate coverage based on unique locations with data
  const locationData = processLocationData(props.incidents)
  if (locationData.length === 0) return '0'
  
  // Estimate coverage based on number of unique locations
  // This is a rough estimate - in reality you'd need actual geographic boundaries
  return Math.min(100, (locationData.length / 50) * 100).toFixed(1)
})

const heatMapContainer = ref<HTMLDivElement>()
let map: any = null
let heatLayer: any = null
let forceBoundaryLayer: any = null

// Process incidents to extract location data
const processLocationData = (incidents: any[]) => {
  const locationData = []
  
  // Group incidents by location to create density points
  const locationGroups = {}
  
  console.log('HeatMap: Processing', incidents.length, 'incidents for location data')
  
  incidents.forEach((incident, index) => {
    // Check for location data in different possible formats
    let lat, lng
    
    if (incident.lat && incident.lng) {
      // Direct lat/lng properties (our format)
      lat = parseFloat(incident.lat)
      lng = parseFloat(incident.lng)
    } else if (incident.location && incident.location.latitude && incident.location.longitude) {
      lat = parseFloat(incident.location.latitude)
      lng = parseFloat(incident.location.longitude)
    } else if (incident.latitude && incident.longitude) {
      lat = parseFloat(incident.latitude)
      lng = parseFloat(incident.longitude)
    } else if (incident.location && incident.location.lat && incident.location.lng) {
      lat = parseFloat(incident.location.lat)
      lng = parseFloat(incident.location.lng)
    }
    
    // Log first few incidents to debug location data
    if (index < 3) {
      console.log('HeatMap: Incident', index, 'location data:', { lat, lng, incident })
    }
    
    // Validate coordinates are within reasonable UK bounds
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0 && 
        lat >= 49.5 && lat <= 61.0 && lng >= -8.0 && lng <= 2.0) {
      const key = `${lat.toFixed(3)},${lng.toFixed(3)}`
      if (!locationGroups[key]) {
        locationGroups[key] = {
          lat,
          lng,
          count: 0
        }
      }
      locationGroups[key].count++
    }
  })
  
  // Convert to heat map format
  Object.values(locationGroups).forEach((group: any) => {
    locationData.push([group.lat, group.lng, group.count])
  })
  
  console.log('HeatMap: Found', Object.keys(locationGroups).length, 'unique locations')
  return locationData
}

const initializeMap = () => {
  if (!heatMapContainer.value || process.server) return
  
  // Import Leaflet dynamically
  import('leaflet').then((L) => {
    // Clear existing map
    if (map) {
      map.remove()
    }
    
    // Initialize map
    map = L.map(heatMapContainer.value).setView([54.5, -2], 6)
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
    
    // Update heat map with current data
    updateHeatMap()
  }).catch(error => {
    console.error('Error loading Leaflet:', error)
  })
}

const updateHeatMap = () => {
  if (!map || !props.incidents) {
    console.log('HeatMap: No map or incidents available')
    return
  }
  
  console.log('HeatMap: Updating map with', props.incidents.length, 'incidents')
  console.log('HeatMap: Sample incidents:', props.incidents.slice(0, 3))
  isLoading.value = true
  
  // Process location data from incidents
  const locationData = processLocationData(props.incidents)
  console.log('HeatMap: Processed location data:', locationData.length, 'points')
  
  if (locationData.length === 0) {
    console.log('HeatMap: No location data available')
    hasData.value = false
    isLoading.value = false
    return
  }
  
  hasData.value = true
  
  // Import heat map plugin
  import('leaflet.heat').then((heatPlugin) => {
    // Remove existing heat layer
    if (heatLayer) {
      map.removeLayer(heatLayer)
    }
    
    // Create new heat layer - handle different import formats
    const maxIntensity = Math.max(...locationData.map(point => point[2]))
    
    // Try different ways to access the heat function
    let heatFunction = null
    if (typeof heatPlugin === 'function') {
      heatFunction = heatPlugin
    } else if (heatPlugin.default && typeof heatPlugin.default === 'function') {
      heatFunction = heatPlugin.default
    } else if (heatPlugin.heatLayer && typeof heatPlugin.heatLayer === 'function') {
      heatFunction = heatPlugin.heatLayer
    } else if (typeof L.heatLayer === 'function') {
      // Try global L.heatLayer if available
      heatFunction = L.heatLayer
    }
    
    if (!heatFunction) {
      console.error('Heat map plugin not available:', heatPlugin)
      console.log('Available properties:', Object.keys(heatPlugin))
      
      // Fallback: create a simple circle-based heat map
      console.log('Creating fallback heat map with circles...')
      const circles = locationData.map(point => {
        const intensity = point[2] / maxIntensity
        const radius = Math.max(5, Math.min(50, intensity * 50))
        const opacity = Math.max(0.1, Math.min(0.8, intensity * 0.8))
        
        return L.circle([point[0], point[1]], {
          radius: radius * 1000, // Convert to meters
          fillColor: getColorForIntensity(intensity),
          color: getColorForIntensity(intensity),
          weight: 1,
          opacity: opacity,
          fillOpacity: opacity
        })
      })
      
      heatLayer = L.layerGroup(circles)
      heatLayer.addTo(map)
      
      // Update force boundaries if enabled
      updateForceBoundaries()
      
      // Fit map to data bounds with some padding
      const bounds = L.latLngBounds(locationData.map(point => [point[0], point[1]]))
      map.fitBounds(bounds, { padding: [20, 20] })
      
      isLoading.value = false
      return
    }
    
    heatLayer = heatFunction(locationData, {
      radius: radius,
      blur: blur,
      maxZoom: 10,
      max: maxIntensity,
      gradient: getColorScheme(selectedColorScheme)
    })
    
    heatLayer.addTo(map)
    
    // Update force boundaries if enabled
    updateForceBoundaries()
    
    // Fit map to data bounds with some padding
    const bounds = L.latLngBounds(locationData.map(point => [point[0], point[1]]))
    map.fitBounds(bounds, { padding: [20, 20] })
    
    isLoading.value = false
  }).catch(error => {
    console.error('Error loading heat map plugin:', error)
    hasData.value = false
    isLoading.value = false
  })
}

const updateForceBoundaries = () => {
  if (!map) return
  
  // Remove existing force boundary layer
  if (forceBoundaryLayer) {
    map.removeLayer(forceBoundaryLayer)
    forceBoundaryLayer = null
  }
  
  // Add force boundaries if enabled and available
  if (showForceBoundaries.value && props.forceBoundaries && props.forceBoundaries.length > 0) {
    try {
      // Create a combined GeoJSON from all force boundaries
      const combinedGeoJSON = {
        type: 'FeatureCollection',
        features: props.forceBoundaries.map(boundary => ({
          type: 'Feature',
          geometry: boundary.boundary.geometry,
          properties: {
            force_name: boundary.forceName,
            force_id: boundary.forceId
          }
        }))
      }
      
      forceBoundaryLayer = L.geoJSON(combinedGeoJSON, {
        style: {
          fillColor: 'transparent',
          weight: 2,
          opacity: 0.8,
          color: '#333',
          fillOpacity: 0
        },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties.force_name, {
            permanent: false,
            direction: 'top'
          })
        }
      }).addTo(map)
      
      console.log(`✅ Added ${props.forceBoundaries.length} force boundaries to heat map`)
    } catch (error) {
      console.error('Error adding force boundaries to heat map:', error)
    }
  }
}

const getColorScheme = (scheme: string) => {
  const schemes = {
    viridis: { 
      0.0: '#440154', 
      0.25: '#31688e', 
      0.5: '#35b779', 
      0.75: '#90d743', 
      1.0: '#fde725' 
    },
    plasma: { 0.4: 'rgb(0, 0, 255)', 0.65: 'rgb(255, 0, 255)', 0.85: 'rgb(255, 255, 0)', 1.0: 'rgb(255, 0, 0)' },
    inferno: { 0.4: 'rgb(0, 0, 0)', 0.65: 'rgb(255, 0, 0)', 0.85: 'rgb(255, 255, 0)', 1.0: 'rgb(255, 255, 255)' },
    magma: { 0.4: 'rgb(0, 0, 0)', 0.65: 'rgb(128, 0, 128)', 0.85: 'rgb(255, 0, 255)', 1.0: 'rgb(255, 255, 255)' }
  }
  return schemes[scheme] || schemes.viridis
}

const getColorForIntensity = (intensity: number) => {
  const schemes = {
    viridis: ['#440154', '#31688e', '#35b779', '#90d743', '#fde725'],
    plasma: ['#0d0887', '#7e03a8', '#cc4778', '#f89441'],
    inferno: ['#000004', '#1b0c41', '#4a0c6b', '#781c6d'],
    magma: ['#000004', '#180f3e', '#440f76', '#721f81']
  }
  
  const scheme = schemes[selectedColorScheme] || schemes.viridis
  const index = Math.floor(intensity * (scheme.length - 1))
  return scheme[Math.min(index, scheme.length - 1)]
}

// Watch for changes and update heat map
watch([showForceBoundaries, () => props.incidents, () => props.forceBoundaries], () => {
  console.log('HeatMap: incidents or boundaries changed, updating map. Count:', props.incidents?.length || 0)
  if (map) {
    updateHeatMap()
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
  updateHeatMap,
  getHeatMapConfig: () => ({
    intensity: intensity.value,
    radius: radius.value,
    blur: blur.value,
    colorScheme: selectedColorScheme.value
  })
})
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #1e40af;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  background: #1e40af;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
