export default defineNuxtPlugin(() => {
  if (process.client) {
    // Unregister any existing service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister()
          console.log('Service worker unregistered')
        }
      })
    }
  }
})
