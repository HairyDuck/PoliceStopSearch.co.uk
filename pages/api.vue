<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- SEO Meta Tags -->
    <Head>
      <title>API Documentation | UK Police Stop and Search Data Portal</title>
      <meta name="description" content="Learn how we use the UK Police Data API and access the official documentation for integrating stop and search data into your applications." />
      <meta name="keywords" content="police API, UK police data API, stop and search API, data.police.uk, API documentation" />
      <meta property="og:title" content="API Documentation | UK Police Stop and Search Data Portal" />
      <meta property="og:description" content="Learn how we use the UK Police Data API and access the official documentation." />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://policestopsearch.co.uk/api" />
    </Head>

    <!-- Page Header -->
    <header class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Learn how we use the UK Police Data API and access the official documentation for integrating stop and search data into your applications.
      </p>
    </header>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Left Column - How We Use the API -->
      <div class="space-y-8">
        <!-- About Our Usage -->
        <section class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-primary bg-opacity-10 rounded-lg">
              <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">How We Use the API</h2>
          </div>
          <p class="text-gray-600 leading-relaxed">
            Our platform fetches data directly from the official UK Police Data API to provide real-time access to stop and search information. We use the same data source that powers official government statistics, ensuring accuracy and reliability.
          </p>
        </section>

        <!-- Data Sources -->
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-4">Data Sources We Access</h3>
          <div class="space-y-4">
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-gray-900">Stop and Search Data</h4>
              <p class="text-sm text-gray-600 mt-1">We fetch stop and search incidents using the <code>/api/stops-street</code> and <code>/api/stops-force</code> endpoints.</p>
            </div>
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-gray-900">Police Force Information</h4>
              <p class="text-sm text-gray-600 mt-1">Force details and contact information from the <code>/api/forces</code> endpoint.</p>
            </div>
            <div class="border-l-4 border-primary pl-4">
              <h4 class="font-semibold text-gray-900">Data Availability</h4>
              <p class="text-sm text-gray-600 mt-1">We check available datasets using the <code>/api/crimes-street-dates</code> endpoint to ensure we're showing the most current data.</p>
            </div>
          </div>
        </section>

        <!-- Update Frequency -->
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-4">Data Update Frequency</h3>
          <div class="space-y-3 text-gray-600">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Data is updated monthly by the police forces</span>
            </div>
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Typically a 2-month delay for data validation</span>
            </div>
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Our platform automatically fetches the latest available data</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column - Official Documentation -->
      <div class="space-y-8">
        <!-- Official Documentation -->
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-4">Official Documentation</h3>
          <div class="space-y-4">
            <a 
              href="https://data.police.uk/docs/"
              target="_blank"
              rel="noopener noreferrer"
              class="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 class="font-semibold text-blue-700">Complete API Documentation</h4>
                    <p class="text-sm text-blue-600">Official reference and examples</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-blue-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            
          </div>
        </section>

        

        <!-- Additional Resources -->
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-4">Additional Resources</h3>
          <div class="space-y-3">
            <a 
              href="https://www.gov.uk/government/publications/stop-and-search-statistics-data-tables"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Official Stop and Search Statistics
            </a>
            <a 
              href="https://www.college.police.uk/app/stop-and-search/stop-and-search"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              College of Policing Guidelines
            </a>
            <a 
              href="https://github.com/police-data-uk/police-data-uk"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Police Data UK GitHub
            </a>
          </div>
        </section>
      </div>
    </div>

    <!-- Call to Action -->
    <section class="mt-12 text-center">
      <div class="bg-primary text-white rounded-lg p-8">
        <h2 class="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p class="text-lg mb-6">Access the official UK Police Data API documentation to start building your applications.</p>
        <a 
          href="https://data.police.uk/docs/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Official Documentation
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'

useHead({
  title: 'API Documentation | UK Police Stop and Search Data Portal',
  meta: [
    {
      name: 'description',
      content: 'Learn how we use the UK Police Data API and access the official documentation for integrating stop and search data into your applications.'
    },
    {
      name: 'keywords',
      content: 'police API, UK police data API, stop and search API, data.police.uk, API documentation'
    },
    {
      property: 'og:title',
      content: 'API Documentation | UK Police Stop and Search Data Portal'
    },
    {
      property: 'og:description',
      content: 'Learn how we use the UK Police Data API and access the official documentation.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://policestopsearch.co.uk/api'
    }
  ]
})
</script> 