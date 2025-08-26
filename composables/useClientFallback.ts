import { useRuntimeConfig } from 'nuxt/app'

export const useClientFallback = () => {
  const config = useRuntimeConfig()
  
  // Determine the correct base URL for API calls
  const getBaseURL = () => {
    // In development, use localhost
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000'
    }
    // In production, use the configured site URL or fallback
    return config.public.siteUrl || 'https://policestopsearch.co.uk'
  }
  
  const baseURL = getBaseURL()
  
  // Check if API endpoints are available
  const checkApiAvailability = async () => {
    try {
      const response = await fetch(`${baseURL}/api/cache?action=stats`)
      return response.ok
    } catch {
      return false
    }
  }
  
  // Fallback for cache functionality
  const getCacheFallback = async (key: string) => {
    console.log('📦 Using client-side cache fallback for:', key)
    // Return empty cache data
    return { cached: false, data: null, fallback: true }
  }
  
  // Fallback for force data
  const getForceDataFallback = async (force: string, date?: string) => {
    console.log('📊 Using client-side force data fallback for:', force, date)
    return {
      forceId: force,
      forceName: force,
      month: date || '',
      total: 0,
      arrests: 0,
      arrestsPercentage: 0,
      outcomes: {},
      ageBreakdown: {},
      genderBreakdown: {},
      ethnicityBreakdown: {},
      objectOfSearch: {},
      legislation: {},
      locationBreakdown: {},
      byHour: {},
      byDay: {},
      byMonth: {},
      mostCommonObject: 'None',
      mostCommonObjectCount: 0,
      fallback: true
    }
  }
  
  // Fallback for transparency analysis
  const getTransparencyAnalysisFallback = async () => {
    console.log('🔍 Using client-side transparency analysis fallback')
    return {
      forcesWithIssues: [],
      analysis: {},
      fallback: true
    }
  }
  
  // Enhanced API call with fallback
  const apiCallWithFallback = async (endpoint: string, options?: any, fallbackFn?: () => any) => {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, options)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.log(`⚠️ API call failed for ${endpoint}, using fallback`)
    }
    
    // Use fallback if provided
    if (fallbackFn) {
      return await fallbackFn()
    }
    
    // Default fallback
    return { fallback: true, error: 'API not available' }
  }
  
  return {
    checkApiAvailability,
    getCacheFallback,
    getForceDataFallback,
    getTransparencyAnalysisFallback,
    apiCallWithFallback,
    baseURL
  }
}
