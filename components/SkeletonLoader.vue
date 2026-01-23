<template>
  <div class="animate-pulse">
    <!-- Card skeleton -->
    <div v-if="type === 'card'" class="bg-white rounded-lg shadow-sm p-6">
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    
    <!-- List skeleton -->
    <div v-else-if="type === 'list'" class="space-y-3">
      <div v-for="i in count" :key="i" class="flex items-center space-x-4">
        <div class="h-12 w-12 bg-gray-200 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
    
    <!-- Map skeleton -->
    <div v-else-if="type === 'map'" class="bg-gray-200 rounded-lg h-[500px] flex items-center justify-center">
      <div class="text-center">
        <div class="loading-spinner mx-auto mb-2"></div>
        <p class="text-gray-600">Loading map...</p>
      </div>
    </div>
    
    <!-- Chart skeleton -->
    <div v-else-if="type === 'chart'" class="bg-white rounded-lg shadow-sm p-6">
      <div class="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div class="h-64 bg-gray-100 rounded"></div>
    </div>
    
    <!-- Default skeleton -->
    <div v-else class="space-y-3">
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'card' | 'list' | 'map' | 'chart' | 'default'
  count?: number
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  count: 3
})
</script>

<style scoped>
.loading-spinner {
  @apply w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin;
}
</style>
