import { defineNuxtPlugin } from 'nuxt/app'
import { useStopSearchStore } from '../stores/stopsearch'

export default defineNuxtPlugin((nuxtApp) => {
  // Wait for app to be mounted before initializing store
  nuxtApp.vueApp.mixin({
    mounted() {
      const store = useStopSearchStore()
      // Only initialize if not already initialized
      if (!store._initialized) {
        store.initializeFromStorage()
      }
    }
  })
}) 