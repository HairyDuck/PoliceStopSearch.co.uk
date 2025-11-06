<script setup lang="ts">
import { useRouter, useRoute, onMounted } from 'vue-router'

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
