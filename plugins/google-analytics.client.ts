import { defineNuxtPlugin } from 'nuxt/app'
import { useRouter } from 'vue-router'

export default defineNuxtPlugin(() => {
  const head = document.head
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-TC5QTVC5WP'
  head.appendChild(script1)

  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'G-TC5QTVC5WP')

  // Make gtag available globally
  window.gtag = gtag

  // Add route change tracking
  const router = useRouter()
  router.afterEach((to) => {
    gtag('event', 'page_view', {
      page_path: to.fullPath,
      page_title: document.title
    })
  })
})

// Add type declaration for gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
} 