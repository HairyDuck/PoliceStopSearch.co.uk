export default defineNuxtConfig({
  // Target: https://go.nuxtjs.dev/config-target
  ssr: true, // Enable SSR for better SEO
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
        '/terms',
        '/faq',
        '/api/sitemap.xml'
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
          content: 'Explore UK police stop and search data with interactive maps, statistics, and detailed incident information. Access comprehensive police transparency data across all UK forces.'
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'PoliceStopSearch.co.uk' },
        { name: 'keywords', content: 'police data, stop and search, UK police, crime statistics, law enforcement data, police transparency, UK crime data, police accountability' },
        
        // Open Graph
        { property: 'og:title', content: 'UK Police Stop and Search Data Portal' },
        { property: 'og:description', content: 'Explore UK police stop and search data with interactive maps, statistics, and detailed incident information.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://policestopsearch.co.uk' },
        { property: 'og:site_name', content: 'PoliceStopSearch.co.uk' },
        { property: 'og:locale', content: 'en_GB' },
        
        
        // Additional SEO
        { name: 'application-name', content: 'PoliceStopSearch.co.uk' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'msapplication-config', content: '/browserconfig.xml' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/puk-logo.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://policestopsearch.co.uk' },
        { rel: 'manifest', href: '/manifest.json' },
        { 
          rel: 'preload', 
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          as: 'style',
          onload: "this.onload=null;this.rel='stylesheet'"
        },
        { 
          rel: 'stylesheet', 
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
          crossorigin: '',
          media: 'print',
          onload: "this.media='all'"
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'UK Police Stop and Search Data Portal',
            description: 'Explore UK police stop and search data with interactive maps, statistics, and detailed incident information.',
            url: 'https://policestopsearch.co.uk',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://policestopsearch.co.uk/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'PoliceStopSearch.co.uk',
            url: 'https://policestopsearch.co.uk',
            logo: 'https://policestopsearch.co.uk/logo.png',
            sameAs: [
              'https://github.com/HairyDuck/PoliceStopSearch.co.uk'
            ]
          })
        }
      ]
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.scss'
  ],

  // Critical CSS optimization
  experimental: {
    inlineSSRStyles: false
  },

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
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'leaflet': ['leaflet'],
            'chart': ['chart.js']
          }
        }
      }
    }
  },

  compatibilityDate: '2025-02-07'
})