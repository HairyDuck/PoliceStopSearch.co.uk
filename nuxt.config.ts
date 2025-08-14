export default defineNuxtConfig({
  // Target: https://go.nuxtjs.dev/config-target
  ssr: false,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/map',
        '/statistics',
        '/forces',
        '/about',
        '/privacy',
        '/terms'
      ]
    }
  },

  // Base URL configuration for static deployment
  app: {
    cdnURL: '',
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'UK Police Stop and Search Data Portal',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { 
          name: 'description', 
          content: 'Explore UK police stop and search data with interactive maps, statistics, and detailed incident information.'
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { 
          rel: 'stylesheet', 
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
          crossorigin: ''
        }
      ]
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/leaflet.client.ts', mode: 'client' },
    { src: '@/plugins/chart.client.ts', mode: 'client' },
    { src: '@/plugins/google-analytics.client.ts', mode: 'client' },
    { src: '@/plugins/google-adsense.client.ts', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // Runtime Config
  runtimeConfig: {
    public: {
      apiBase: 'https://data.police.uk/api'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['chart.js', 'vue-chartjs']
  },

  // Development tools
  devtools: { enabled: true },

  vite: {
    optimizeDeps: {
      include: ['leaflet', 'leaflet.markercluster']
    }
  },

  compatibilityDate: '2025-02-07'
})