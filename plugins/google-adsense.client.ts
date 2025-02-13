import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const head = document.head
  const script = document.createElement('script')
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3907468540135854'
  script.setAttribute('data-ad-client', 'ca-pub-3907468540135854')
  head.appendChild(script)
})

// Add type declaration for AdSense
declare global {
  interface Window {
    adsbygoogle: any[]
  }
} 