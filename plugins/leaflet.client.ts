import { defineNuxtPlugin } from 'nuxt/app'
import L from 'leaflet'
import 'leaflet.heat'

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconUrl: '/images/leaflet/marker-icon.png',
  shadowUrl: '/images/leaflet/marker-shadow.png',
})

export default defineNuxtPlugin(() => {
  return {
    provide: {
      L
    }
  }
}) 