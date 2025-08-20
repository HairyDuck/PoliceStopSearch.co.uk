<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- SEO Meta Tags -->
    <Head>
      <title>UK Police Forces | Stop and Search Data by Force</title>
      <meta name="description" content="Compare stop and search data across UK police forces." />
      <meta name="keywords" content="UK police forces, police force comparison, stop and search by force, police force statistics" />
      <meta property="og:title" content="UK Police Forces | Stop and Search Data by Force" />
      <meta property="og:description" content="Browse and compare stop and search data across different UK police forces. View force-specific statistics and trends." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="UK Police Forces" />
      <meta name="twitter:description" content="Compare stop and search data across UK police forces." />
      <link rel="canonical" href="https://policestopsearch.co.uk/forces" />
    </Head>

    <!-- Page Header -->
    <header class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">UK Police Forces</h1>
      <p class="text-xl text-gray-600">
        Detailed information about police forces across the United Kingdom.
      </p>
    </header>

    <!-- Forces Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div 
        v-for="force in forces" 
        :key="force.id"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div class="p-6">
          <!-- Force Header -->
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-start space-x-4">
              <!-- Force Badge -->
              <div class="w-16 h-16 flex-shrink-0">
                <img 
                  :src="getForceLogoUrl(force.id)"
                  :alt="`${force.name} Badge`"
                  class="w-full h-full object-contain"
                  @error="handleImageError($event)"
                />
              </div>
              <div>
                <h2 class="text-2xl font-semibold text-gray-900">{{ force.name }}</h2>
              </div>
            </div>

            <!-- Statistics Button -->
            <NuxtLink 
              :to="{ path: '/statistics', query: { force: force.id }}"
              class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Statistics
            </NuxtLink>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading && selectedForceId === force.id" class="py-4 text-center">
            <div class="loading-spinner mx-auto mb-2"></div>
            <p class="text-sm text-gray-600">Loading force details...</p>
          </div>

          <!-- Force Details -->
          <div v-if="forceDetails[force.id]" class="space-y-6">
            <!-- Main Links -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Website -->
              <a 
                v-if="forceDetails[force.id].url"
                :href="forceDetails[force.id].url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="font-medium text-blue-700">Official Website</span>
                </div>
                <svg class="h-5 w-5 text-blue-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <!-- Phone -->
              <a 
                v-if="forceDetails[force.id].telephone"
                :href="'tel:' + forceDetails[force.id].telephone"
                class="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span class="font-medium text-green-700">{{ forceDetails[force.id].telephone }}</span>
                </div>
                <svg class="h-5 w-5 text-green-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <!-- Social Media Links -->
            <div v-if="forceDetails[force.id].engagement_methods?.length" class="space-y-3">
              <h3 class="text-lg font-medium text-gray-900">Connect With Us</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <template v-for="method in forceDetails[force.id].engagement_methods" :key="method.type">
                  <a
                    v-if="method.url && method.type !== 'telephone'"
                    :href="method.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-between p-3 rounded-lg transition-colors group"
                    :class="getSocialMediaClass(method.type)"
                  >
                    <div class="flex items-center">
                      <span class="text-2xl mr-3">{{ getSocialMediaIcon(method.type) }}</span>
                      <div>
                        <span class="font-medium">{{ method.title || method.type }}</span>
                        <div v-if="method.description" class="text-sm opacity-75" v-html="sanitizeHtml(method.description)"></div>
                      </div>
                    </div>
                    <svg class="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </template>
              </div>
            </div>

            <!-- Description Preview -->
            <div v-if="forceDetails[force.id].description" class="border-t pt-4">
              <div class="text-gray-600 line-clamp-2" v-html="sanitizeHtml(forceDetails[force.id].description)"></div>
              <button 
                @click="showFullDescription(force.id)"
                class="mt-2 text-primary hover:text-primary-dark font-medium inline-flex items-center"
              >
                Read More
                <svg class="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Load Details Button -->
          <button
            v-if="!forceDetails[force.id] && !isLoading"
            @click="loadForceDetails(force.id)"
            class="mt-4 w-full bg-gray-50 text-gray-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Contact Information
          </button>
        </div>
      </div>
    </div>

    <!-- Full Description Modal -->
    <div 
      v-if="selectedForceDescription"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold">
              {{ getForceNameById(selectedForceDescription) }}
            </h3>
            <button 
              @click="selectedForceDescription = null"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="prose max-w-none">
            <div v-html="sanitizeHtml(forceDetails[selectedForceDescription]?.description)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resources Section -->
    <section class="mt-12 bg-gray-50 rounded-lg p-8">
      <h2 class="text-2xl font-bold mb-6">Additional Resources</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Official Police Resources -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-3">Official Resources</h3>
          <div class="space-y-3">
            <a 
              href="https://www.gov.uk/government/organisations/home-office"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Home Office
            </a>
            <a 
              href="https://www.college.police.uk/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              College of Policing
            </a>
            <a 
              href="https://www.police.uk/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Police.uk
            </a>
          </div>
        </div>

        <!-- Data and Statistics -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-3">Data & Statistics</h3>
          <div class="space-y-3">
            <a 
              href="https://data.police.uk/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Police Data Portal
            </a>
            <a 
              href="https://www.gov.uk/government/statistics/police-powers-and-procedures-england-and-wales"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Official Statistics
            </a>
            <a 
              href="https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              ONS Crime Statistics
            </a>
          </div>
        </div>

        <!-- Legal Information -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-3">Legal Information</h3>
          <div class="space-y-3">
            <a 
              href="https://www.legislation.gov.uk/ukpga/1984/60/contents"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Police and Criminal Evidence Act
            </a>
            <a 
              href="https://www.gov.uk/police-powers-to-stop-and-search-your-rights"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your Rights
            </a>
            <a 
              href="https://www.legislation.gov.uk/ukpga/2000/23/contents"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Terrorism Act 2000
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import policeForceBadges from '../police_forces.json'

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

// Server-side data fetching
const forcesData = await $fetch('/api/forces')

// State
const forces = ref((forcesData as any)?.forces || [] as { id: string; name: string }[])
const forceDetails = ref<Record<string, ForceDetails>>((forcesData as any)?.forceDetails || {})
const isLoading = ref(false)
const selectedForceId = ref<string | null>(null)
const selectedForceDescription = ref<string | null>(null)

// Methods
const loadForceDetails = async (forceId: string) => {
  if (forceDetails.value[forceId]) return
  
  try {
    isLoading.value = true
    selectedForceId.value = forceId
    
    const response = await fetch(`https://data.police.uk/api/forces/${forceId}`)
    if (!response.ok) throw new Error('Failed to fetch force details')
    
    const data = await response.json()
    forceDetails.value[forceId] = data
  } catch (error) {
    console.error('Error loading force details:', error)
  } finally {
    isLoading.value = false
    selectedForceId.value = null
  }
}

const showFullDescription = (forceId: string) => {
  selectedForceDescription.value = forceId
}

const getForceNameById = (forceId: string | null) => {
  if (!forceId) return ''
  return forces.value.find(f => f.id === forceId)?.name || ''
}

const getSocialMediaClass = (type: string) => {
  if (!type) return 'bg-gray-50 text-gray-700 hover:bg-gray-100'
  
  switch (type.toLowerCase()) {
    case 'facebook':
      return 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    case 'twitter':
      return 'bg-sky-50 text-sky-700 hover:bg-sky-100'
    case 'youtube':
      return 'bg-red-50 text-red-700 hover:bg-red-100'
    case 'instagram':
      return 'bg-pink-50 text-pink-700 hover:bg-pink-100'
    case 'linkedin':
      return 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    case 'rss':
      return 'bg-orange-50 text-orange-700 hover:bg-orange-100'
    default:
      return 'bg-gray-50 text-gray-700 hover:bg-gray-100'
  }
}

const getSocialMediaIcon = (type: string) => {
  if (!type) return '🔗'
  
  switch (type.toLowerCase()) {
    case 'facebook':
      return '📘'
    case 'twitter':
      return '🐦'
    case 'youtube':
      return '📺'
    case 'instagram':
      return '📸'
    case 'linkedin':
      return '💼'
    case 'rss':
      return '📰'
    default:
      return '🔗'
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/images/forces/default.png'
  target.classList.add('opacity-50')
}

const getForceLogoUrl = (forceId: string): string => {
  return (policeForceBadges as Record<string, { name: string, logo_url: string }>)[forceId]?.logo_url || '/images/forces/default.png'
}

// Add sanitizeHtml function
const sanitizeHtml = (html: string | null): string => {
  if (!html) return ''
  // Remove <p> tags but keep line breaks
  return html
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '<br>')
    .replace(/<br\s*\/?>\s*$/, '') // Remove trailing line break
    .trim()
}

// Lifecycle
onMounted(async () => {
  // Data is already loaded server-side, no additional loading needed
})
</script>

<style scoped>
.loading-spinner {
  @apply w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 