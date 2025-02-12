<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary text-white py-16 -mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            UK Police Stop and Search Data Portal
          </h1>
          <p class="text-xl mb-8">
            Access and analyse UK police stop and search data through interactive maps and detailed statistics. Promoting transparency and informed discussions through accurate data.
          </p>
          <div class="flex justify-center space-x-4">
            <NuxtLink to="/map" class="btn btn-secondary">
              View Interactive Map
            </NuxtLink>
            <NuxtLink to="/statistics" class="btn btn-outline">
              View Statistics
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- SEO Meta Tags -->
    <Head>
      <title>UK Police Stop and Search Data Portal | Interactive Maps & Statistics</title>
      <meta name="description" content="Access and analyse UK police stop and search data through interactive maps and detailed statistics. Promoting transparency and informed discussions through accurate data." />
      <meta name="keywords" content="police data, stop and search, UK police, crime statistics, law enforcement data, police transparency" />
      <meta property="og:title" content="UK Police Stop and Search Data Portal" />
      <meta property="og:description" content="Access and analyse UK police stop and search data through interactive maps and detailed statistics. Promoting transparency and informed discussions through accurate data." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="UK Police Stop and Search Data Portal" />
      <meta name="twitter:description" content="Access and analyse UK police stop and search data through interactive maps and detailed statistics." />
      <link rel="canonical" href="https://policestopsearch.co.uk" />
    </Head>

    <!-- Open Source Banner -->
    <section class="bg-secondary/10 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-3xl">🌟</div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Open Source Project</h2>
              <p class="text-gray-600">This project is open source and welcomes community contributions!</p>
            </div>
          </div>
          <div>
            <a 
              href="https://github.com/HairyDuck/PoliceStopSearch.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl mb-4">🗺️</div>
            <h3 class="text-xl font-semibold mb-4">Interactive Map</h3>
            <p class="text-gray-600">
              Explore stop and search incidents on an interactive map. Filter by location, date, and more.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-semibold mb-4">Detailed Statistics</h3>
            <p class="text-gray-600">
              Access comprehensive statistics and trends about stop and search incidents across the UK.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl mb-4">📱</div>
            <h3 class="text-xl font-semibold mb-4">Mobile Friendly</h3>
            <p class="text-gray-600">
              Access the data portal on any device with our responsive design.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Official Resources -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Official Resources</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Police.uk Resources -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Police.uk Resources</h3>
            <ul class="space-y-4">
              <li>
                <a 
                  href="https://www.college.police.uk/app/stop-and-search/stop-and-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Stop and Search Overview
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gov.uk/police-powers-to-stop-and-search-your-rights"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Know Your Rights
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gov.uk/government/publications/best-use-of-stop-and-search-scheme"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Best Use of Stop and Search
                </a>
              </li>
            </ul>
          </div>

          <!-- Government Resources -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Government Resources</h3>
            <ul class="space-y-4">
              <li>
                <a 
                  href="https://www.gov.uk/government/publications/stop-and-search-statistics-data-tables"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  Official Statistics
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ethnicity-facts-figures.service.gov.uk/crime-justice-and-the-law/policing/stop-and-search/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Ethnicity Facts and Figures
                </a>
              </li>
              <li>
                <a 
                  href="https://www.justiceinspectorates.gov.uk/hmicfrs/our-work/article/stop-and-search/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  HMICFRS Reports
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-8">Start Exploring Now</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
          Discover insights about police stop and search practices in your area and across the UK.
        </p>
        <NuxtLink to="/map" class="btn btn-primary">
          View Interactive Map
        </NuxtLink>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div class="grid gap-8 max-w-3xl mx-auto">
          <!-- Data Source FAQ -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-xl font-semibold mb-4">Where does the data come from?</h3>
            <p class="text-gray-600">
              All data is sourced directly from the official UK Police Data API (data.police.uk). This ensures that our information is accurate, up-to-date, and matches official records.
            </p>
          </div>

          <!-- Data Updates FAQ -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-xl font-semibold mb-4">How often is the data updated?</h3>
            <p class="text-gray-600">
              The UK Police Data API updates its data monthly, typically with a two-month delay. For example, January's data becomes available in March. This delay allows for proper data validation and processing by police forces. We automatically fetch the latest available data as soon as it's published.
            </p>
          </div>

          <!-- Data Coverage FAQ -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-xl font-semibold mb-4">What time period does the data cover?</h3>
            <p class="text-gray-600">
              Our platform provides access to the last 24 months of stop and search data. The current month and previous month are typically not available due to the processing delay in the official police data system. This ensures we only display validated and complete data sets.
            </p>
          </div>

          <!-- Data Accuracy FAQ -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-xl font-semibold mb-4">How accurate is the data?</h3>
            <p class="text-gray-600">
              The data comes directly from police records and undergoes validation before being published. However, some incidents might have incomplete information or approximate locations for privacy and operational reasons. We clearly indicate when data is estimated or incomplete.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import type { Map as LeafletMap } from 'leaflet'

// Remove statistics data
const mapPreview = ref<HTMLElement | null>(null)
let previewMap: LeafletMap | null = null

onMounted(async () => {
  try {
    // Remove statistics calculation
    // Initialize map preview
    if (mapPreview.value) {
      const { $L } = useNuxtApp()
      const L = $L as typeof import('leaflet')
      previewMap = L.map(mapPreview.value, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false
      }).setView([51.505, -0.09], 10)

      if (previewMap) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(previewMap)
      }
    }
  } catch (error) {
    console.error('Error initializing map:', error)
  }
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark;
}

.btn-secondary {
  @apply bg-secondary text-white hover:bg-secondary-dark;
}

.btn-outline {
  @apply border-2 border-white text-white hover:bg-white hover:text-primary;
}

.btn-white {
  @apply bg-white text-primary hover:bg-gray-100;
}
</style> 