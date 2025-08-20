<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p class="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist. Here are some helpful links to get you back on track.
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Quick Navigation -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Popular Pages</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink 
              to="/"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Home</p>
                <p class="text-sm text-gray-500">Back to the main page</p>
              </div>
            </NuxtLink>

            <NuxtLink 
              to="/map"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Interactive Map</p>
                <p class="text-sm text-gray-500">Explore stop and search data</p>
              </div>
            </NuxtLink>

            <NuxtLink 
              to="/statistics"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Statistics</p>
                <p class="text-sm text-gray-500">View detailed statistics</p>
              </div>
            </NuxtLink>

            <NuxtLink 
              to="/forces"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Police Forces</p>
                <p class="text-sm text-gray-500">Browse UK police forces</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Search Section -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Looking for something specific?</h3>
          <div class="space-y-3">
            <NuxtLink 
              to="/about"
              class="block text-sm text-primary hover:text-primary-dark"
            >
              About our platform
            </NuxtLink>
            <NuxtLink 
              to="/api"
              class="block text-sm text-primary hover:text-primary-dark"
            >
              API documentation
            </NuxtLink>
            <NuxtLink 
              to="/faq"
              class="block text-sm text-primary hover:text-primary-dark"
            >
              Frequently asked questions
            </NuxtLink>
            <a 
              href="https://github.com/HairyDuck/PoliceStopSearch.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-sm text-primary hover:text-primary-dark"
            >
              GitHub repository
            </a>
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <button 
            @click="$router.go(-1)"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'

// Set error page meta tags
useHead({
  title: '404 - Page Not Found | UK Police Stop and Search Data Portal',
  meta: [
    {
      name: 'description',
      content: 'Page not found. Navigate to our interactive map, statistics, or police forces pages to explore UK police stop and search data.'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})

// Handle error
const error = useError()

// Clear error after 5 seconds
onMounted(() => {
  setTimeout(() => {
    clearError()
  }, 5000)
})
</script>
