import { ref, onMounted } from 'vue'

export const useMobile = () => {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  const checkDeviceType = () => {
    const userAgent = navigator.userAgent
    const width = window.innerWidth
    
    // Check for mobile devices
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    isMobile.value = mobileRegex.test(userAgent) || width <= 768
    
    // Check for tablet devices
    isTablet.value = width > 768 && width <= 1024
    
    // Check for desktop devices
    isDesktop.value = width > 1024
  }

  onMounted(() => {
    checkDeviceType()
    
    // Listen for resize events
    window.addEventListener('resize', checkDeviceType)
    window.addEventListener('orientationchange', () => {
      setTimeout(checkDeviceType, 100)
    })
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    checkDeviceType
  }
} 