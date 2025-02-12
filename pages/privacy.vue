<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- SEO Meta Tags -->
    <Head>
      <title>Privacy Policy | UK Police Stop and Search Data Portal</title>
      <meta name="description" content="Our privacy policy explains how we handle data and cookies on our platform." />
      <meta name="keywords" content="privacy policy, cookies policy, data usage" />
      <link rel="canonical" href="https://policestopsearch.co.uk/privacy" />
    </Head>

    <h1 class="text-3xl font-bold mb-8">Privacy Policy</h1>

    <div class="prose max-w-none">
      <div class="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <section>
          <h2 class="text-xl font-semibold mb-4">Introduction</h2>
          <p>
            This Privacy Policy explains how our website works and what data is used when you visit. We are committed to being transparent about our data practices and ensuring you understand how our site operates.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Data Usage</h2>
          <p>
            Our platform exclusively uses publicly available data from the UK Police Data API (data.police.uk). We do not collect, store, or process any personal information from our users. The stop and search data displayed on our platform is already anonymized at the source.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Cookies</h2>
          <p>We use a minimal set of cookies that are necessary for the website to function:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> These are required for basic site functionality:
              <ul class="list-disc pl-6 mt-2">
                <li>Session cookie to maintain your map view state</li>
                <li>Local storage for caching police force data to improve performance</li>
              </ul>
            </li>
            <li>
              <strong>Analytics Cookies:</strong> We use Google Analytics with data anonymization enabled to understand how our site is used and improve the user experience. These cookies do not contain any personal information.
            </li>
          </ul>
          <p class="mt-4">
            You can control or disable cookies through your browser settings. However, some parts of the site may not function properly if cookies are disabled.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Location Data</h2>
          <p>
            If you use the "Use My Location" feature on our map, your browser will request your current location. This data is only used temporarily to center the map and is never stored or transmitted to our servers.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Third-Party Services</h2>
          <p>Our site uses the following third-party services:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>Google Analytics (with IP anonymization)</li>
            <li>OpenStreetMap for map visualization</li>
            <li>UK Police Data API for stop and search data</li>
          </ul>
          <p class="mt-2">
            Each service has its own privacy policy and data handling practices. We encourage you to review their policies if you want more information.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <a href="mailto:support@policestopsearch.co.uk" class="text-primary hover:text-primary-dark">
              support@policestopsearch.co.uk
            </a>
          </p>
        </section>

        <section>
          <p class="text-sm text-gray-600 mt-8">
            Last updated: February 2025
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'

useHead({
  title: 'Privacy Policy | UK Police Stop and Search Data Portal',
  meta: [
    {
      name: 'description',
      content: 'Our privacy policy explains how we handle data and cookies on our platform.'
    }
  ]
})
</script> 