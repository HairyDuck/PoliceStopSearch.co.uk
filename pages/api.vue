<template>
  <div class="text-center py-12">
    <h1 class="text-3xl font-bold mb-4">API Documentation</h1>
    <p class="text-xl text-gray-600 mb-8">Redirecting to the official UK Police Data API documentation...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.location.href = 'https://data.police.uk/docs/'
})
</script> 