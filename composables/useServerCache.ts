export const useServerCache = () => {
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
  
  // Get cached data from server
  const getCached = async (key: string) => {
    try {
      const response = await $fetch(`${baseURL}/api/cache`, {
        query: { action: 'get', key }
      })
      return response
    } catch (error) {
      console.error('❌ Server cache get error:', error)
      return { cached: false, data: null }
    }
  }
  
  // Set data in server cache
  const setCached = async (key: string, data: any, ttl?: number) => {
    try {
      const response = await $fetch(`${baseURL}/api/cache`, {
        method: 'POST',
        body: {
          action: 'set', 
          key, 
          data: JSON.stringify(data),
          ttl: ttl?.toString() || '7776000000' // 90 days default
        }
      })
      return response
    } catch (error) {
      console.error('❌ Server cache set error:', error)
      return { success: false }
    }
  }
  
  // Delete cached data
  const deleteCached = async (key: string) => {
    try {
      const response = await $fetch(`${baseURL}/api/cache`, {
        query: { action: 'delete', key }
      })
      return response
    } catch (error) {
      console.error('❌ Server cache delete error:', error)
      return { success: false }
    }
  }
  
  // Clear all server cache
  const clearServerCache = async () => {
    try {
      const response = await $fetch(`${baseURL}/api/cache`, {
        query: { action: 'clear' }
      })
      return response
    } catch (error) {
      console.error('❌ Server cache clear error:', error)
      return { success: false }
    }
  }
  
  // Get server cache statistics
  const getServerCacheStats = async () => {
    try {
      const response = await $fetch(`${baseURL}/api/cache`, {
        query: { action: 'stats' }
      })
      return response
    } catch (error) {
      console.error('❌ Server cache stats error:', error)
      return null
    }
  }
  
  // Check if server cache is available
  const isServerCacheAvailable = async () => {
    try {
      await $fetch(`${baseURL}/api/cache`, {
        query: { action: 'stats' }
      })
      return true
    } catch {
      return false
    }
  }
  
  // Get multiple cached entries at once
  const getMultipleCached = async (keys: string[]) => {
    try {
      const response = await $fetch(`${baseURL}/api/cache`, {
        method: 'POST',
        body: {
          action: 'getMultiple', 
          keys: JSON.stringify(keys)
        }
      })
      return response
    } catch (error) {
      console.error('❌ Server cache getMultiple error:', error)
      return { cached: {}, cachedCount: 0, missingKeys: keys, totalRequested: keys.length }
    }
  }
  
  // Set multiple entries at once
  const setMultipleCached = async (data: { [key: string]: any }, ttl?: number) => {
    try {
      const response = await $fetch(`${baseURL}/api/cache`, {
        method: 'POST',
        body: {
          action: 'setMultiple', 
          data: JSON.stringify(data),
          ttl: ttl?.toString() || '7776000000' // 90 days default
        }
      })
      return response
    } catch (error) {
      console.error('❌ Server cache setMultiple error:', error)
      return { success: false }
    }
  }
  
  // Get force data for specific months
  const getForceData = async (forceId: string, months: string[]) => {
    try {
      const response = await $fetch(`${baseURL}/api/cache`, {
        method: 'POST',
        body: {
          action: 'getForceData', 
          forceId,
          months: JSON.stringify(months)
        }
      })
      return response
    } catch (error) {
      console.error('❌ Server cache getForceData error:', error)
      return { 
        forceId, 
        cached: {}, 
        cachedCount: 0, 
        missingMonths: months, 
        totalMonths: months.length 
      }
    }
  }
  
  return {
    getCached,
    setCached,
    deleteCached,
    clearServerCache,
    getServerCacheStats,
    isServerCacheAvailable,
    getMultipleCached,
    setMultipleCached,
    getForceData
  }
}
