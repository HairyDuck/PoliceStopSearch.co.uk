<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- SEO Meta Tags -->
    <Head>
      <title>Terms of Service | UK Police Stop and Search Data Portal</title>
      <meta name="description" content="Terms and conditions for using our platform to explore UK police stop and search data." />
      <meta name="keywords" content="terms of service, terms and conditions, user agreement, legal terms" />
      <link rel="canonical" href="https://policestopsearch.co.uk/terms" />
    </Head>

    <h1 class="text-3xl font-bold mb-8">Terms of Service</h1>

    <div class="prose max-w-none">
      <div class="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <section>
          <h2 class="text-xl font-semibold mb-4">1. Introduction</h2>
          <p>
            These Terms of Service govern your use of the UK Police Stop and Search Data Portal. By accessing or using our website, you agree to be bound by these terms. If you disagree with any part of these terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">2. Data Usage and Limitations</h2>
          <p>
            All data presented on this platform is sourced from the official UK Police Data API. While we strive to ensure accuracy, we make no guarantees about the completeness, reliability, or suitability of the data for any purpose.
          </p>
          <ul class="list-disc pl-6 space-y-2 mt-2">
            <li>You may use the data for personal, research, or journalistic purposes</li>
            <li>Attribution to both our platform and data.police.uk is required when using the data</li>
            <li>Commercial use of the data must comply with data.police.uk's terms of service</li>
            <li>We are not responsible for any conclusions or decisions made based on the data</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">3. User Responsibilities</h2>
          <p>When using our service, you agree to:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>Use the service in accordance with applicable laws and regulations</li>
            <li>Not attempt to disrupt or compromise the service's security</li>
            <li>Not use the service for any unlawful purpose</li>
            <li>Not attempt to access data or areas beyond public access</li>
            <li>Not use automated systems to access the service without our permission</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">4. Intellectual Property</h2>
          <p>
            The website design, layout, and functionality are protected by intellectual property rights owned by us. The underlying data is subject to Crown Copyright and data.police.uk's terms of use.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">5. Disclaimers</h2>
          <p>
            This service is provided "as is" without any warranties, expressed or implied. We do not warrant that:
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li>The service will be uninterrupted or error-free</li>
            <li>The data will be completely accurate or up-to-date</li>
            <li>The service will be available at all times</li>
            <li>Any errors will be corrected</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p>
            We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any changes by updating the date at the bottom of this page. Continued use of the service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">8. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">9. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
            <a href="mailto:support@policestopsearch.co.uk" class="text-primary hover:text-primary-dark">
              support@policestopsearch.co.uk
            </a>
          </p>
        </section>

        <section>
          <p class="text-sm text-gray-600 mt-8">
            Last updated: February 2024
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'

useHead({
  title: 'Terms of Service | UK Police Stop and Search Data Portal',
  meta: [
    {
      name: 'description',
      content: 'Terms and conditions for using our platform to explore UK police stop and search data.'
    }
  ]
})
</script> 