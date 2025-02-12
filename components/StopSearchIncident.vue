<template>
  <div class="card p-6">
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-semibold">{{ formatDate(incident.datetime) }}</h3>
        <p class="text-gray-600">{{ incident.location.street.name }}</p>
      </div>
      <div :class="getOutcomeClass()">
        {{ incident.outcome }}
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <h4 class="font-semibold mb-1">Type of Search</h4>
        <p>{{ incident.type }}</p>
      </div>
      <div>
        <h4 class="font-semibold mb-1">Object of Search</h4>
        <p>{{ incident.object_of_search }}</p>
      </div>
      <div>
        <h4 class="font-semibold mb-1">Gender</h4>
        <p>{{ incident.gender }}</p>
      </div>
      <div>
        <h4 class="font-semibold mb-1">Age Range</h4>
        <p>{{ incident.age_range }}</p>
      </div>
      <div>
        <h4 class="font-semibold mb-1">Self-Defined Ethnicity</h4>
        <p>{{ incident.self_defined_ethnicity || 'Not stated' }}</p>
      </div>
      <div>
        <h4 class="font-semibold mb-1">Officer-Defined Ethnicity</h4>
        <p>{{ incident.officer_defined_ethnicity }}</p>
      </div>
    </div>

    <!-- Legislation -->
    <div class="mb-4">
      <h4 class="font-semibold mb-1">Legislation</h4>
      <p class="text-sm">{{ incident.legislation }}</p>
    </div>

    <!-- Operation -->
    <div v-if="incident.operation" class="mb-4">
      <h4 class="font-semibold mb-1">Operation</h4>
      <p>{{ incident.operation }}</p>
    </div>

    <!-- Location -->
    <div>
      <h4 class="font-semibold mb-2">Location</h4>
      <div class="h-48 bg-gray-100 rounded-lg relative">
        <div
          ref="mapContainer"
          class="absolute inset-0"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import L from 'leaflet'

interface Location {
  street: {
    name: string;
  };
  latitude: number;
  longitude: number;
}

interface Incident {
  datetime: string;
  location: Location;
  type: string;
  object_of_search: string;
  outcome: string;
  gender: string;
  age_range: string;
  self_defined_ethnicity: string;
  officer_defined_ethnicity: string;
  legislation: string;
  operation?: string;
}

const props = defineProps<{
  incident: Incident;
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

// Format date string
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get CSS class for outcome badge
const getOutcomeClass = (): string => {
  const baseClass = 'px-3 py-1 rounded-full text-sm font-medium'
  const outcome = props.incident.outcome.toLowerCase()

  if (outcome.includes('arrest')) {
    return `${baseClass} bg-red-100 text-red-800`
  } else if (outcome.includes('no further action')) {
    return `${baseClass} bg-gray-100 text-gray-800`
  } else if (outcome.includes('caution')) {
    return `${baseClass} bg-yellow-100 text-yellow-800`
  } else {
    return `${baseClass} bg-blue-100 text-blue-800`
  }
}

// Initialize map
onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView(
      [props.incident.location.latitude, props.incident.location.longitude],
      16
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    L.marker([props.incident.location.latitude, props.incident.location.longitude])
      .addTo(map)
  }
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-100;
}
</style> 