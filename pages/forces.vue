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
              :to="{ path: '/analytics', query: { force: force.id }}"
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
                    v-if="method.url && method.type !== 'telephone' && method.type !== 'web'"
                    :href="method.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-between p-3 rounded-lg transition-colors group"
                    :class="getSocialMediaClass(method.type)"
                  >
                    <div class="flex items-center">
                      <div class="w-6 h-6 mr-3 flex-shrink-0" v-html="getSocialMediaIcon(method.type)"></div>
                      <div>
                        <span class="font-medium">{{ getSocialMediaLabel(method.type) || method.title || method.type }}</span>
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
import { useRuntimeConfig } from 'nuxt/app'
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

// Server-side data fetching with fallback for static generation
const config = useRuntimeConfig()
const baseURL = config.public.siteUrl || 'http://localhost:3000'

let forcesData: any = null

// Only try to fetch data on client side to avoid build issues
if (process.client) {
  try {
    // Use PHP API for forces data
    const apiURL = process.env.NODE_ENV === 'development' ? baseURL : 'https://api.policestopsearch.co.uk'
    forcesData = await $fetch(`${apiURL}/cache.php`, {
      query: { action: 'get', key: 'forces' }
    })
    if (forcesData.cached && forcesData.data) {
      forcesData = forcesData.data
    } else {
      // If not cached, fetch from external API and cache it
      const externalResponse = await fetch('https://data.police.uk/api/forces')
      if (externalResponse.ok) {
        const forces = await externalResponse.json()
        forcesData = { forces, forceDetails: {} }
        // Cache the data
        await $fetch(`${apiURL}/cache.php`, {
          method: 'POST',
          body: {
            action: 'set',
            key: 'forces',
            data: JSON.stringify(forcesData),
            ttl: '86400000' // 24 hours
          }
        })
      } else {
        throw new Error('Failed to fetch forces data')
      }
    }
  } catch (error) {
    console.warn('Failed to fetch forces data during build, using fallback:', error)
  }
}

// Use fallback data for static generation
if (!forcesData) {
  forcesData = {
    forces: [
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
    ],
    forceDetails: {}
  }
}

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
  
  const lowerType = type.toLowerCase()
  switch (lowerType) {
    case 'facebook':
      return 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    case 'twitter':
    case 'x':
      return 'bg-black text-white hover:bg-gray-800'
    case 'youtube':
      return 'bg-red-50 text-red-700 hover:bg-red-100'
    case 'instagram':
      return 'bg-pink-50 text-pink-700 hover:bg-pink-100'
    case 'linkedin':
      return 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    case 'flickr':
      return 'bg-pink-50 text-pink-700 hover:bg-pink-100'
    case 'rss':
      return 'bg-orange-50 text-orange-700 hover:bg-orange-100'
    default:
      return 'bg-gray-50 text-gray-700 hover:bg-gray-100'
  }
}

const getSocialMediaIcon = (type: string): string => {
  if (!type) {
    return '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>'
  }
  
  const lowerType = type.toLowerCase()
  switch (lowerType) {
    case 'facebook':
      return '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
    case 'twitter':
    case 'x':
      return '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
    case 'youtube':
      return '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
    case 'instagram':
      return '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
    case 'linkedin':
      return '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
    case 'flickr':
      return '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm9-2c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/></svg>'
    case 'rss':
      return '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/></svg>'
    default:
      return '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>'
  }
}

const getSocialMediaLabel = (type: string): string => {
  if (!type) return ''
  
  const lowerType = type.toLowerCase()
  switch (lowerType) {
    case 'twitter':
    case 'x':
      return 'X (Twitter)'
    case 'facebook':
      return 'Facebook'
    case 'flickr':
      return 'Flickr'
    case 'youtube':
      return 'YouTube'
    default:
      return ''
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