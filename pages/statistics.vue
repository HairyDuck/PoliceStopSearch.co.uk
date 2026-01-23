<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useHead } from 'nuxt/app'

// SEO meta tags for redirect page
useHead({
  title: 'Statistics | UK Police Data Portal',
  meta: [
    {
      name: 'description',
      content: 'View detailed statistics and analytics for UK police stop and search data.'
    },
    {
      'http-equiv': 'refresh',
      content: '0; url=/analytics' + (route.query.force ? `?force=${route.query.force}` : '')
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://policestopsearch.co.uk/analytics' + (route.query.force ? `?force=${route.query.force}` : '')
    }
  ]
})

// Redirect to analytics page
const router = useRouter()
const route = useRoute()

onMounted(() => {
  // Preserve query parameters if any
  const query = route.query
  router.replace({
    path: '/analytics',
    query: query
  })
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center">
      <p>Redirecting to Analytics...</p>
    </div>
  </div>
</template>
