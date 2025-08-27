<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- SEO Meta Tags -->
    <Head>
      <title>Frequently Asked Questions | UK Police Stop and Search Data Portal</title>
      <meta name="description" content="Find answers to common questions about UK police stop and search data, our data sources, updates, and how to use the platform." />
      <meta name="keywords" content="police data FAQ, stop and search questions, UK police data help, data accuracy, data updates" />
      <link rel="canonical" href="https://policestopsearch.co.uk/faq" />
    </Head>

    <h1 class="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

    <div class="space-y-6">
      <!-- Data Source -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Where does the data come from?</h2>
        <p class="text-gray-600">
          All data is sourced directly from the official UK Police Data API (data.police.uk). This ensures that our information is accurate, up-to-date, and matches official records. We do not modify or alter the data in any way, only presenting it in an accessible format.
        </p>
      </div>

      <!-- Data Updates -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">How often is the data updated?</h2>
        <p class="text-gray-600">
          The UK Police Data API updates its data monthly, typically with a two-month delay. For example, January's data becomes available in March. This delay allows for proper data validation and processing by police forces. Our platform automatically fetches the latest available data as soon as it's published.
        </p>
      </div>

      <!-- Data Coverage -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">What time period does the data cover?</h2>
        <p class="text-gray-600">
          Our platform provides access to the last 24 months of stop and search data. The current month and previous month are typically not available due to the processing delay in the official police data system. This ensures we only display validated and complete data sets.
        </p>
      </div>

      <!-- Data Accuracy -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">How accurate is the data?</h2>
        <p class="text-gray-600">
          The data comes directly from police records and undergoes validation before being published. However, some incidents might have incomplete information or approximate locations for privacy and operational reasons. We clearly indicate when data is estimated or incomplete.
        </p>
      </div>

      <!-- Platform Usage -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">How do I use the interactive map?</h2>
        <p class="text-gray-600">
          The interactive map allows you to explore stop and search incidents geographically. You can:
        </p>
        <ul class="list-disc list-inside mt-2 space-y-2 text-gray-600">
          <li>Zoom and pan to explore different areas</li>
          <li>Click on markers to view incident details</li>
          <li>Filter data by date using the date picker</li>
          <li>Switch between map view and force view</li>
          <li>Use your current location to view nearby incidents</li>
        </ul>
      </div>

      <!-- Data Download -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Can I download the data?</h2>
        <p class="text-gray-600">
          Yes, you can access the raw data directly from the <a href="https://data.police.uk" class="text-primary hover:text-primary-dark">data.police.uk</a> website. Our platform focuses on visualization and analysis of this data. For direct API access, please refer to our <a href="/api" class="text-primary hover:text-primary-dark">API documentation</a>.
        </p>
      </div>

      <!-- Platform Affiliation -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Is this an official police website?</h2>
        <p class="text-gray-600">
          No, this is an independent open-source platform. We are not affiliated with, endorsed by, or operated by any UK police force or government agency. Our mission is to make public police data more accessible and transparent through better visualization and analysis tools.
        </p>
      </div>

      <!-- Additional Resources -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Additional Resources</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Official Sources</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="https://data.police.uk" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-dark">
                  UK Police Data Portal
                </a>
              </li>
              <li>
                <a href="https://www.gov.uk/government/publications/stop-and-search-statistics-data-tables" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-dark">
                  Government Statistics
                </a>
              </li>
              <li>
                <a href="https://www.college.police.uk/app/stop-and-search/stop-and-search" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-dark">
                  College of Policing Guidelines
                </a>
              </li>
              <li>
                <a href="https://www.ethnicity-facts-figures.service.gov.uk/crime-justice-and-the-law/policing/stop-and-search/latest" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-dark">
                  Ethnicity Facts & Figures
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Research & Advocacy</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="https://www.libertyhumanrights.org.uk/issue/stop-and-search/" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-dark">
                  Liberty - Stop and Search
                </a>
              </li>
              <li>
                <a href="https://www.stop-watch.org/" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-dark">
                  StopWatch
                </a>
              </li>
              <li>
                <a href="https://www.ucl.ac.uk/jill-dando-institute/" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-dark">
                  UCL Jill Dando Institute
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Related Pages</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="/about" class="text-primary hover:text-primary-dark">
                  About Our Platform
                </a>
              </li>
              <li>
                <a href="/api" class="text-primary hover:text-primary-dark">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="/privacy" class="text-primary hover:text-primary-dark">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'

useHead({
  title: 'Frequently Asked Questions | UK Police Stop and Search Data Portal',
  meta: [
    {
      name: 'description',
      content: 'Find answers to common questions about UK police stop and search data, our data sources, updates, and how to use the platform.'
    }
  ]
})
</script> 