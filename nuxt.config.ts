export default defineNuxtConfig({
  // Target: https://go.nuxtjs.dev/config-target
  ssr: true, // Enable SSR for better SEO
  
  // Static site generation for FTP hosting
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/analytics',
        '/statistics',
        '/statistics?force=avon-and-somerset',
        '/statistics?force=bedfordshire',
        '/statistics?force=cambridgeshire',
        '/statistics?force=cheshire',
        '/statistics?force=city-of-london',
        '/statistics?force=cleveland',
        '/statistics?force=cumbria',
        '/statistics?force=derbyshire',
        '/statistics?force=devon-and-cornwall',
        '/statistics?force=dorset',
        '/statistics?force=durham',
        '/statistics?force=dyfed-powys',
        '/statistics?force=essex',
        '/statistics?force=gloucestershire',
        '/statistics?force=greater-manchester',
        '/statistics?force=gwent',
        '/statistics?force=hampshire',
        '/statistics?force=hertfordshire',
        '/statistics?force=kent',
        '/statistics?force=lancashire',
        '/statistics?force=leicestershire',
        '/statistics?force=merseyside',
        '/statistics?force=metropolitan',
        '/statistics?force=norfolk',
        '/statistics?force=north-wales',
        '/statistics?force=north-yorkshire',
        '/statistics?force=northamptonshire',
        '/statistics?force=northumbria',
        '/statistics?force=nottinghamshire',
        '/statistics?force=south-wales',
        '/statistics?force=south-yorkshire',
        '/statistics?force=staffordshire',
        '/statistics?force=suffolk',
        '/statistics?force=surrey',
        '/statistics?force=sussex',
        '/statistics?force=thames-valley',
        '/statistics?force=warwickshire',
        '/statistics?force=west-mercia',
        '/statistics?force=west-midlands',
        '/statistics?force=west-yorkshire',
        '/statistics?force=wiltshire',
        '/api/sitemap.xml',
        '/forces',
        '/about',
        '/privacy',
        '/terms',
        '/faq'
      ],
      ignore: [
        '/map',
        '/manifest.json'
      ]
    }
  },

  // Base URL configuration for static deployment
  app: {
    cdnURL: '',
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'UK Police Stop and Search Data Portal | Interactive Crime Statistics & Maps',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { 
          name: 'description', 
          content: 'Access and analyse UK police stop and search data through interactive maps, detailed statistics, and comprehensive incident information across all UK police forces.'
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'PoliceStopSearch.co.uk' },
        // Cache-busting headers
        { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
        { 'http-equiv': 'Pragma', content: 'no-cache' },
        { 'http-equiv': 'Expires', content: '0' },
        { name: 'keywords', content: 'police data, stop and search, UK police, crime statistics, law enforcement data, police transparency, UK crime data, police accountability' },
        
        // Open Graph
        { property: 'og:title', content: 'UK Police Stop and Search Data Portal' },
        { property: 'og:description', content: 'Explore UK police stop and search data with interactive maps, statistics, and detailed incident information.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://policestopsearch.co.uk' },
        { property: 'og:site_name', content: 'PoliceStopSearch.co.uk' },
        { property: 'og:locale', content: 'en_GB' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@PoliceStopSearch' },
        { name: 'twitter:title', content: 'UK Police Stop and Search Data Portal' },
        { name: 'twitter:description', content: 'Explore UK police stop and search data with interactive maps, statistics, and detailed incident information.' },
        
        
        // Additional SEO
        { name: 'application-name', content: 'PoliceStopSearch.co.uk' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'msapplication-config', content: '/browserconfig.xml' },
        { 
          'http-equiv': 'Content-Security-Policy', 
          content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.policestopsearch.co.uk https://data.police.uk https://www.google-analytics.com https://pagead2.googlesyndication.com https://www.googletagmanager.com; frame-src https://www.google.com https://googleads.g.doubleclick.net; object-src 'none'; base-uri 'self'; form-action 'self';"
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/puk-logo.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://policestopsearch.co.uk' },

        { rel: 'alternate', hreflang: 'en', href: 'https://policestopsearch.co.uk' },
        { rel: 'alternate', hreflang: 'en-GB', href: 'https://policestopsearch.co.uk' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://policestopsearch.co.uk' },
        { 
          rel: 'stylesheet', 
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
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
  // Note: inlineSSRStyles is deprecated in Nuxt 3

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/unregister-sw.client.ts', mode: 'client' },
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
      apiBase: 'https://data.police.uk/api',
      siteUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://policestopsearch.co.uk'
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