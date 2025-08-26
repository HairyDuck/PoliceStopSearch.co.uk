import { defineStore } from 'pinia'
// import { format, subMonths } from 'date-fns'

// Server cache composable will be imported dynamically

// Custom error types
class StopSearchError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message)
    this.name = 'StopSearchError'
  }
}

class APIError extends StopSearchError {
  constructor(message: string, public status: number, public statusText: string) {
    super(message, 'API_ERROR', { status, statusText })
    this.name = 'APIError'
  }
}

class DateError extends StopSearchError {
  constructor(message: string) {
    super(message, 'DATE_ERROR')
    this.name = 'DateError'
  }
}

class NetworkError extends StopSearchError {
  constructor(message: string, public originalError: Error) {
    super(message, 'NETWORK_ERROR', { originalError })
    this.name = 'NetworkError'
  }
}

interface StopSearchLocation {
  latitude: string
  longitude: string
  street: {
    id: number
    name: string
  }
}

interface OutcomeObject {
  id: string
  name: string
}

interface StopSearchIncident {
  age_range: string | null
  officer_defined_ethnicity: string | null
  involved_person: boolean
  self_defined_ethnicity: string | null
  gender: string | null
  legislation: string | null
  outcome_linked_to_object_of_search: boolean | null
  datetime: string
  outcome_object: OutcomeObject | null
  location: StopSearchLocation
  object_of_search: string | null
  operation: string | null
  outcome: string | null
  type: 'Person search' | 'Vehicle search' | 'Person and Vehicle search'
  operation_name: string | null
  removal_of_more_than_outer_clothing: boolean | null
}

interface AvailableDataset {
  date: string;
  'stop-and-search': string[];
}

interface StopSearchData {
  [key: string]: StopSearchIncident[] // Cache key -> stop search data array
}

interface ForceData {
  id: string
  name: string
}

export const useStopSearchStore = defineStore('stopsearch', {
  state: () => ({
    cache: {
      area: {} as StopSearchData,      // Cache for area searches
      location: {} as StopSearchData,   // Cache for location searches
      force: {} as StopSearchData,      // Cache for force searches
      customArea: {} as StopSearchData, // Cache for custom area searches
    },
    forces: [] as ForceData[],          // List of all police forces
    selectedMode: 'area' as 'area' | 'location' | 'force' | 'customArea',
    cacheTimeout: 90 * 24 * 60 * 60 * 1000, // Cache timeout (90 days - very aggressive caching)
    cacheTimes: {} as { [key: string]: number }, // Timestamp for each cache entry
    latestAvailableDate: new Date().toISOString().slice(0, 7), // Default to current month
    isCheckingLatestDate: false,
    errors: [] as StopSearchError[], // Track recent errors
    maxErrors: 10, // Maximum number of errors to keep
    availableDatasets: [] as AvailableDataset[], // Available datasets from API
    // Rate limiting and analytics cache management
    lastApiCall: 0, // Timestamp of last API call
    minApiInterval: 500, // Increased to 500ms between API calls to prevent rate limiting
    analyticsCacheWarmed: false, // Track if analytics cache has been warmed
    _initialized: false, // Track if store has been initialized
    failedRequests: {} as { [key: string]: number }, // Track failed requests for backoff
    consecutiveFailures: 0, // Track consecutive failures for circuit breaker
    
    // Server cache state
    serverCacheAvailable: false, // Track if server cache is available
    serverCacheStats: null as any, // Server cache statistics
    serverCacheChecked: false, // Track if server cache availability has been checked
  }),

  actions: {
    // Load data from localStorage on initialization
    async initializeFromStorage() {
      if (process.server) return
      
      // Prevent multiple initializations
      if (this._initialized) {
        return
      }
      
      // Check server cache availability first
      await this.checkServerCacheAvailability()
      
      try {
        // Load available datasets
        const storedDatasets = localStorage.getItem('availableDatasets')
        const storedDatasetsTimestamp = localStorage.getItem('availableDatasetsTimestamp')
        
        if (storedDatasets && storedDatasetsTimestamp) {
          const timestamp = parseInt(storedDatasetsTimestamp)
          // Check if the data is less than 24 hours old
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            this.availableDatasets = JSON.parse(storedDatasets)
            if (this.availableDatasets.length > 0) {
              this.latestAvailableDate = this.availableDatasets[0].date
            }
          }
        }

        // Load forces
        const storedForces = localStorage.getItem('forces')
        if (storedForces) {
          this.forces = JSON.parse(storedForces)
        }

        // Load cache data
        const storedCache = localStorage.getItem('searchCache')
        const storedCacheTimes = localStorage.getItem('cacheTimes')
        if (storedCache && storedCacheTimes) {
          this.cache = JSON.parse(storedCache)
          this.cacheTimes = JSON.parse(storedCacheTimes)
          
          // Only clear expired cache if we have a significant amount of data
          const cacheEntryCount = Object.keys(this.cacheTimes).length
          if (cacheEntryCount > 1000) { // Increased threshold for 44 forces × 24 months
            this.clearExpiredCache() // Clean up any expired entries
          }
          
          // Optimize cache for large datasets
          this.optimizeCacheForLargeDataset()
        }
        
        // Mark as initialized
        this._initialized = true
      } catch (error) {
        console.error('❌ Error loading from localStorage:', error)
        // If there's an error, clear localStorage to prevent future issues
        localStorage.removeItem('availableDatasets')
        localStorage.removeItem('availableDatasetsTimestamp')
        localStorage.removeItem('forces')
        localStorage.removeItem('searchCache')
        localStorage.removeItem('cacheTimes')
      }
    },

    // Save cache to localStorage
    saveToStorage() {
      try {
        // Enhanced cache management for 44 forces × 24 months (1,056 entries max)
        const maxCacheItemsPerMode = 1200 // Increased for 44 forces × 24 months + buffer
        const maxTotalSize = 15 * 1024 * 1024 // 15MB limit for large datasets
        
        // First pass: limit items per mode
        Object.keys(this.cache).forEach(mode => {
          const cacheEntries = Object.entries(this.cache[mode])
          if (cacheEntries.length > maxCacheItemsPerMode) {
            // Keep only the most recent entries
            const sortedEntries = cacheEntries.sort(([keyA, a], [keyB, b]) => {
              const aTime = this.cacheTimes[keyA] || 0
              const bTime = this.cacheTimes[keyB] || 0
              return bTime - aTime
            })
            this.cache[mode] = Object.fromEntries(sortedEntries.slice(0, maxCacheItemsPerMode))
            
            // Clean up cacheTimes for removed entries
            sortedEntries.slice(maxCacheItemsPerMode).forEach(([key]) => {
              delete this.cacheTimes[key]
            })
          }
        })

        // Try to save with stringified data
        let cacheString = JSON.stringify(this.cache)
        let cacheTimesString = JSON.stringify(this.cacheTimes)
        
        // If total size is too large, progressively remove older items until it fits
        while ((cacheString.length + cacheTimesString.length) > maxTotalSize && Object.keys(this.cacheTimes).length > 0) {
          // Find and remove oldest cache entry
          const oldestKey = Object.entries(this.cacheTimes)
            .sort(([, a], [, b]) => (a as number) - (b as number))[0][0]
          
          // Remove from both cache and cacheTimes
          Object.keys(this.cache).forEach(mode => {
            delete this.cache[mode][oldestKey]
          })
          delete this.cacheTimes[oldestKey]
          
          // Recalculate strings
          cacheString = JSON.stringify(this.cache)
          cacheTimesString = JSON.stringify(this.cacheTimes)
        }

        // Final save attempt
        try {
          localStorage.setItem('searchCache', cacheString)
          localStorage.setItem('cacheTimes', cacheTimesString)
        } catch (e) {
          if (e.name === 'QuotaExceededError') {
            // If still failing, clear all but the most recent entries
            this.clearAllCache()
            // Keep only the 5 most recent entries per mode
            Object.keys(this.cache).forEach(mode => {
              const entries = Object.entries(this.cache[mode])
                .sort(([keyA], [keyB]) => (this.cacheTimes[keyB] || 0) - (this.cacheTimes[keyA] || 0))
                .slice(0, 5)
              this.cache[mode] = Object.fromEntries(entries)
            })
            // Try one final time
            localStorage.setItem('searchCache', JSON.stringify(this.cache))
            localStorage.setItem('cacheTimes', JSON.stringify(this.cacheTimes))
          } else {
            throw e
          }
        }
      } catch (error) {
        console.error('Error saving cache to localStorage:', error)
        // If still failing, clear all cache
        this.clearAllCache()
      }
    },

    // Get cache key based on parameters
    getCacheKey(params: { [key: string]: any }): string {
      return Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    },

    // Check if cache is valid - very aggressive caching
    isCacheValid(key: string): boolean {
      const timestamp = this.cacheTimes[key]
      if (!timestamp) return false
      
      const age = Date.now() - timestamp
      const isValid = age < this.cacheTimeout
      
      // Only log cache misses, not hits, to reduce console noise
      if (process.client && !isValid) {
        console.log(`Cache expired for ${key}: age=${Math.round(age / (1000 * 60 * 60 * 24))}d`)
      }
      
      return isValid
    },

    // Cache data with timestamp
    setCacheData(mode: 'area' | 'location' | 'force' | 'customArea', key: string, data: StopSearchIncident[]) {
      this.cache[mode][key] = data
      this.cacheTimes[key] = Date.now()
      this.saveToStorage()
    },

    // Get cache statistics
    getCacheStats() {
      const stats = {
        totalEntries: 0,
        totalSize: 0,
        byMode: {} as Record<string, { entries: number, size: number }>,
        forceEntries: 0, // Specific count for force cache entries
        maxCapacity: 1056 // 44 forces × 24 months
      }

      Object.keys(this.cache).forEach(mode => {
        const entries = Object.keys(this.cache[mode]).length
        const size = JSON.stringify(this.cache[mode]).length
        stats.totalEntries += entries
        stats.totalSize += size
        stats.byMode[mode] = { entries, size }
        
        // Track force cache specifically
        if (mode === 'force') {
          stats.forceEntries = entries
        }
      })

      return stats
    },

    // Check if server cache is available
    async checkServerCacheAvailability() {
      if (process.server) return
      
      // Only check once to prevent multiple API calls
      if (this.serverCacheChecked) {
        console.log('🔄 Server cache already checked, skipping...')
        return
      }
      
      // In development mode, skip server cache check to prevent excessive API calls
      if (process.env.NODE_ENV === 'development') {
        console.log('🚫 Development mode: skipping server cache check')
        this.serverCacheAvailable = false
        this.serverCacheChecked = true
        return
      }
      
      console.log('🔍 Checking server cache availability...')
      
      try {
        const { useServerCache } = await import('@/composables/useServerCache')
        const { isServerCacheAvailable } = useServerCache()
        this.serverCacheAvailable = await isServerCacheAvailable()
        
        if (this.serverCacheAvailable) {
          console.log('✅ Server cache is available')
          const { getServerCacheStats } = useServerCache()
          this.serverCacheStats = await getServerCacheStats()
        } else {
          console.log('❌ Server cache is not available')
        }
        
        // Mark as checked to prevent future calls
        this.serverCacheChecked = true
        console.log('✅ Server cache check completed')
      } catch (error) {
        console.log('❌ Server cache check failed:', error)
        this.serverCacheAvailable = false
        this.serverCacheChecked = true
      }
    },

    // Get data from server cache first, then client cache
    async getCachedData(key: string, mode: string = 'force') {
      // Try server cache first
      if (this.serverCacheAvailable) {
        try {
          const { useServerCache } = await import('@/composables/useServerCache')
          const { getCached } = useServerCache()
          const serverResult = await getCached(key)
          
          if (serverResult.cached) {
            if (process.client) {
              console.log(`🖥️ Server cache hit: ${key}`)
            }
            return serverResult.data
          }
        } catch (error) {
          if (process.client) {
            console.log(`❌ Server cache error for ${key}:`, error)
          }
        }
      }
      
      // Fallback to client cache
      if (this.cache[mode] && this.cache[mode][key]) {
        if (this.isCacheValid(key)) {
          if (process.client) {
            console.log(`💾 Client cache hit: ${key}`)
          }
          return this.cache[mode][key]
        } else {
          // Remove expired entry
          delete this.cache[mode][key]
          delete this.cacheTimes[key]
        }
      }
      
      return null
    },

    // Save data to both server and client cache
    async saveCachedData(key: string, data: any, mode: string = 'force') {
      // Save to server cache first
      if (this.serverCacheAvailable) {
        try {
          const { useServerCache } = await import('@/composables/useServerCache')
          const { setCached } = useServerCache()
          await setCached(key, data, this.cacheTimeout)
          
          if (process.client) {
            console.log(`🖥️ Saved to server cache: ${key}`)
          }
        } catch (error) {
          if (process.client) {
            console.log(`❌ Server cache save error for ${key}:`, error)
          }
        }
      }
      
      // Also save to client cache as backup
      if (!this.cache[mode]) {
        this.cache[mode] = {}
      }
      this.cache[mode][key] = data
      this.cacheTimes[key] = Date.now()
      
      if (process.client) {
        console.log(`💾 Saved to client cache: ${key}`)
      }
    },

    // NEW: Aggregated data approach - much more memory efficient
    async getForcesDataAggregated(forceIds: string[], months: string[]) {
      const results: { [forceId: string]: { [month: string]: any } } = {}
      const missingRequests: { forceId: string, month: string }[] = []
      
      // Initialize results structure
      forceIds.forEach(forceId => {
        results[forceId] = {}
      })
      
      // Check server cache first for aggregated data
      if (this.serverCacheAvailable) {
        try {
          const { useServerCache } = await import('@/composables/useServerCache')
          const { getMultipleCached } = useServerCache()
          
          // Generate cache keys for aggregated data
          const cacheKeys: string[] = []
          forceIds.forEach(forceId => {
            months.forEach(month => {
              cacheKeys.push(`aggregated:${forceId}:${month}`)
            })
          })
          
          const serverResult = await getMultipleCached(cacheKeys)
          
          // Process cached aggregated data
          Object.entries(serverResult.cached).forEach(([key, data]) => {
            const [, forceId, month] = key.split(':')
            if (results[forceId]) {
              results[forceId][month] = data
            }
          })
          
          // Track missing data that needs to be fetched
          serverResult.missingKeys.forEach(key => {
            const [, forceId, month] = key.split(':')
            missingRequests.push({ forceId, month })
          })
          
        } catch (error) {
          // If server cache fails, mark all as missing
          forceIds.forEach(forceId => {
            months.forEach(month => {
              missingRequests.push({ forceId, month })
            })
          })
        }
      } else {
        // No server cache, check client cache
        forceIds.forEach(forceId => {
          months.forEach(month => {
            const key = `aggregated:${forceId}:${month}`
            const cachedData = this.getCachedData(key, 'force')
            if (cachedData) {
              results[forceId][month] = cachedData
            } else {
              missingRequests.push({ forceId, month })
            }
          })
        })
      }
      
      // Fetch missing data and aggregate it
      if (missingRequests.length > 0) {
        const dataToCache: { [key: string]: any } = {}
        
        // Fetch in small batches to prevent memory issues
        const batchSize = 3
        for (let i = 0; i < missingRequests.length; i += batchSize) {
          const batch = missingRequests.slice(i, i + batchSize)
          
          await Promise.all(batch.map(async ({ forceId, month }) => {
            try {
              // fetchForceData now returns aggregated data directly
              const aggregated = await this.fetchForceData(forceId, month)
              results[forceId][month] = aggregated
              
              // Prepare for caching
              const cacheKey = `aggregated:${forceId}:${month}`
              dataToCache[cacheKey] = aggregated
            } catch (error) {
              // Set empty aggregated data for failed requests
              results[forceId][month] = this.getEmptyAggregatedData()
            }
          }))
          
          // Delay between batches
          if (i + batchSize < missingRequests.length) {
            await new Promise(resolve => setTimeout(resolve, 200))
          }
        }
        
        // Cache aggregated data
        if (Object.keys(dataToCache).length > 0 && this.serverCacheAvailable) {
          try {
            const { useServerCache } = await import('@/composables/useServerCache')
            const { setMultipleCached } = useServerCache()
            await setMultipleCached(dataToCache, this.cacheTimeout)
          } catch (error) {
            // Silent fail for cache errors
          }
        }
      }
      
      return results
    },

    // Enhanced aggregated data with useful summaries
    aggregateStopSearchData(incidents: StopSearchIncident[]) {
      const aggregated = {
        total: incidents.length,
        arrests: 0,
        noAction: 0,
        warnings: 0,
        other: 0,
        // Enhanced summaries
        byEthnicity: {} as Record<string, number>,
        byGender: {} as Record<string, number>,
        byAgeRange: {} as Record<string, number>,
        byLegislation: {} as Record<string, number>,
        byObjectOfSearch: {} as Record<string, number>,
        byType: {} as Record<string, number>,
        byHour: {} as Record<string, number>,
        byDayOfWeek: {} as Record<string, number>,
        locations: [] as Array<{ lat: number, lng: number, count: number }>,
        forceId: '',
        forceName: '',
        month: ''
      }

      if (incidents.length === 0) return aggregated

      // Set force info from first incident
      aggregated.forceId = incidents[0].force_id
      aggregated.forceName = incidents[0].force_name
      aggregated.month = incidents[0].datetime?.substring(0, 7) || ''

      // Enhanced aggregation
      incidents.forEach(incident => {
        // Outcome counting
        const outcome = incident.outcome || 'Unknown'
        if (outcome.includes('Arrest')) {
          aggregated.arrests++
        } else if (outcome.includes('no further action')) {
          aggregated.noAction++
        } else if (outcome.includes('warning')) {
          aggregated.warnings++
        } else {
          aggregated.other++
        }

        // Ethnicity breakdown
        const ethnicity = incident.officer_defined_ethnicity || incident.self_defined_ethnicity || 'Unknown'
        aggregated.byEthnicity[ethnicity] = (aggregated.byEthnicity[ethnicity] || 0) + 1

        // Gender breakdown
        const gender = incident.gender || 'Unknown'
        aggregated.byGender[gender] = (aggregated.byGender[gender] || 0) + 1

        // Age range breakdown
        const ageRange = incident.age_range || 'Unknown'
        aggregated.byAgeRange[ageRange] = (aggregated.byAgeRange[ageRange] || 0) + 1

        // Legislation breakdown
        const legislation = incident.legislation || 'Unknown'
        aggregated.byLegislation[legislation] = (aggregated.byLegislation[legislation] || 0) + 1

        // Object of search breakdown
        const objectOfSearch = incident.object_of_search || 'Unknown'
        aggregated.byObjectOfSearch[objectOfSearch] = (aggregated.byObjectOfSearch[objectOfSearch] || 0) + 1

        // Type breakdown
        const type = incident.type || 'Unknown'
        aggregated.byType[type] = (aggregated.byType[type] || 0) + 1

        // Time analysis
        if (incident.datetime) {
          const date = new Date(incident.datetime)
          const hour = date.getHours().toString()
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
          
          aggregated.byHour[hour] = (aggregated.byHour[hour] || 0) + 1
          aggregated.byDayOfWeek[dayOfWeek] = (aggregated.byDayOfWeek[dayOfWeek] || 0) + 1
        }

        // Location clustering
        if (incident.location?.latitude && incident.location?.longitude) {
          const lat = Math.round(incident.location.latitude * 1000) / 1000
          const lng = Math.round(incident.location.longitude * 1000) / 1000
          
          const existingLocation = aggregated.locations.find(loc => 
            Math.abs(loc.lat - lat) < 0.001 && Math.abs(loc.lng - lng) < 0.001
          )
          
          if (existingLocation) {
            existingLocation.count++
          } else {
            aggregated.locations.push({ lat, lng, count: 1 })
          }
        }
      })

      return aggregated
    },

    // Get empty aggregated data structure
    getEmptyAggregatedData() {
      return {
        total: 0,
        arrests: 0,
        noAction: 0,
        warnings: 0,
        other: 0,
        byEthnicity: {},
        byGender: {},
        byAgeRange: {},
        byLegislation: {},
        byObjectOfSearch: {},
        byType: {},
        byHour: {},
        byDayOfWeek: {},
        locations: [],
        forceId: '',
        forceName: '',
        month: ''
      }
    },

    // Get location data from aggregated data (no individual incidents needed)
    getLocationDataFromAggregated(aggregatedData: any) {
      const locationData = []
      
      if (aggregatedData && aggregatedData.locations) {
        aggregatedData.locations.forEach((location: any) => {
          for (let i = 0; i < location.count; i++) {
            locationData.push({
              lat: location.lat,
              lng: location.lng,
              outcome: 'Aggregated',
              count: location.count
            })
          }
        })
      }
      
      return locationData
    },

    // Helper method to fetch aggregated force data for a specific month
    async fetchForceData(forceId: string, month: string): Promise<any> {
      try {
        const params: Record<string, string> = { force: forceId }
        if (month && month !== 'latest') {
          params.date = month
        }
        
        // Use the PHP API endpoint with correct URL
        const { useServerCache } = await import('@/composables/useServerCache')
        const { getBaseURL } = useServerCache()
        const baseURL = getBaseURL()
        const response = await $fetch(`${baseURL}/force-data.php`, { params })
        
        // The API now returns aggregated data directly
        return response
      } catch (error) {
        console.error(`Error fetching data for ${forceId} (${month}):`, error)
        return this.getEmptyAggregatedData()
      }
    },

    // Optimize cache for 44 forces × 24 months scenario
    optimizeCacheForLargeDataset() {
      const stats = this.getCacheStats()
      
      // Only log if cache is getting very large
      if (stats.totalSize > 20 * 1024 * 1024) { // 20MB warning threshold
        const sizeInMB = Math.round(stats.totalSize / (1024 * 1024) * 100) / 100
        console.log(`⚠️ Large cache detected: ${sizeInMB}MB. Consider clearing if performance is affected.`)
      }
    },

    // Memory management for large datasets
    manageMemoryUsage() {
      // Force garbage collection if available
      if (typeof window !== 'undefined' && window.gc) {
        window.gc()
      }
      
      // Clear client cache if it gets too large
      const stats = this.getCacheStats()
      if (stats.totalSize > 50 * 1024 * 1024) { // 50MB limit
        console.log('🧹 Memory limit reached, clearing client cache...')
        this.clearAllCache()
      }
    },

    // Clear all cache
    clearAllCache() {
      this.cache = {
        area: {},
        location: {},
        force: {},
        customArea: {}
      }
      this.cacheTimes = {}
      this.saveToStorage()
      
      if (process.client) {
        console.log('🗑️ All cache cleared')
      }
    },

    // Load forces if not already loaded
    async loadForces() {
      if (this.forces.length === 0) {
        try {
          if (process.client) {
            console.log('🔄 Loading forces from API...')
          }
          
          // Use the enhanced error handling method
          const response = await this._fetchWithErrorHandling('https://data.police.uk/api/forces')
          this.forces = response
          
          // Cache forces in localStorage
          if (process.client) {
            localStorage.setItem('forces', JSON.stringify(this.forces))
            console.log(`✅ Loaded ${this.forces.length} forces from API`)
          }
        } catch (error) {
          if (process.client) {
            console.log('⚠️ API failed, trying localStorage fallback...')
          }
          
          // If API fails, try to load from localStorage
          const storedForces = localStorage.getItem('forces')
          if (storedForces) {
            this.forces = JSON.parse(storedForces)
            if (process.client) {
              console.log(`✅ Loaded ${this.forces.length} forces from localStorage`)
            }
          } else {
            if (process.client) {
              console.error('❌ No forces available from API or localStorage')
            }
            throw error
          }
        }
      }
      return this.forces
    },

    // Disabled preloading due to API issues - data will load on demand
    async preloadCommonData() {
      if (process.client) {
        console.log('🚀 Preloading disabled - data will load when requested')
      }
      return Promise.resolve()
    },

    // Check which forces are fully cached for the given months
    getCachedForces(forceIds: string[], months: string[]): { cached: string[], uncached: string[] } {
      const cachedForces = []
      const uncachedForces = []
      
      for (const forceId of forceIds) {
        let isFullyCached = true
        
        for (const month of months) {
          const params = { force: forceId, date: month }
          const cacheKey = this.getCacheKey(params)
          
          if (!this.cache.force[cacheKey] || !this.isCacheValid(cacheKey)) {
            isFullyCached = false
            break
          }
        }
        
        if (isFullyCached) {
          cachedForces.push(forceId)
        } else {
          uncachedForces.push(forceId)
        }
      }
      
      return { cached: cachedForces, uncached: uncachedForces }
    },

    // Get cached data for specific forces
    getCachedDataForForces(forceIds: string[], months: string[]): any[] {
      const allIncidents = []
      
      for (const forceId of forceIds) {
        for (const month of months) {
          const params = { force: forceId, date: month }
          const cacheKey = this.getCacheKey(params)
          
          if (this.cache.force[cacheKey] && this.isCacheValid(cacheKey)) {
            const cachedData = this.cache.force[cacheKey]
            if (Array.isArray(cachedData)) {
              allIncidents.push(...cachedData)
            }
          }
        }
      }
      
      return allIncidents
    },

    // Specialized method for analytics data loading with granular caching
    async getAnalyticsData(forceIds: string[], months: string[], progressCallback?: (current: number, total: number, task: string, detail: string, incidentsLoaded?: number) => void) {
      if (process.server) return []
      
      // Check which forces are cached vs need API calls
      const { cached: cachedForces, uncached: uncachedForces } = this.getCachedForces(forceIds, months)
      
      if (process.client) {
        console.log(`📊 Cache analysis: ${cachedForces.length} forces cached, ${uncachedForces.length} forces need API calls`)
        if (cachedForces.length > 0) {
          console.log(`📦 Cached forces: ${cachedForces.join(', ')}`)
        }
        if (uncachedForces.length > 0) {
          console.log(`🌐 Forces needing API calls: ${uncachedForces.join(', ')}`)
        }
      }
      
      const allIncidents = []
      let currentProgress = 0
      const totalRequests = forceIds.length * months.length
      
      // First, load all cached data instantly
      if (cachedForces.length > 0) {
        if (process.client) {
          console.log(`🚀 Loading ${cachedForces.length} cached forces instantly...`)
        }
        const cachedData = this.getCachedDataForForces(cachedForces, months)
        allIncidents.push(...cachedData)
        currentProgress += cachedForces.length * months.length
        
        if (progressCallback) {
          progressCallback(currentProgress, totalRequests, 'Loading cached data...', `Loaded ${cachedForces.length} forces from cache`, allIncidents.length)
        }
      }
      
      // Then, fetch only the uncached forces
      if (uncachedForces.length > 0) {
        if (process.client) {
          console.log(`🌐 Fetching ${uncachedForces.length} uncached forces from API...`)
        }
        
        for (const forceId of uncachedForces) {
          for (const month of months) {
            if (progressCallback) {
              progressCallback(currentProgress + 1, totalRequests, 'Fetching data...', `Loading ${forceId} - ${month}`)
            }
            
            try {
              const incidents = await this.getStopsByForce(forceId, month)
              if (Array.isArray(incidents)) {
                allIncidents.push(...incidents)
              }
              
              // Add delay between API calls to prevent rate limiting
              await new Promise(resolve => setTimeout(resolve, 1000))
            } catch (error) {
              console.error(`Failed to load data for ${forceId} - ${month}:`, error)
              // Continue with other requests
            }
            
            currentProgress++
          }
        }
      }
      
      if (process.client) {
        const cacheHitRate = cachedForces.length > 0 ? Math.round((cachedForces.length / forceIds.length) * 100) : 0
        console.log(`📦 Cache hit rate: ${cachedForces.length}/${forceIds.length} forces (${cacheHitRate}%)`)
        console.log(`✅ Analytics data loaded: ${allIncidents.length} total incidents`)
      }
      
      return allIncidents
    },

    // Error handling methods
    _addError(error: StopSearchError) {
      this.errors.unshift(error)
      if (this.errors.length > this.maxErrors) {
        this.errors.pop()
      }
      console.error(`[StopSearch] ${error.name}:`, error.message, error.details || '')
    },

    _clearErrors() {
      this.errors = []
    },

    // Rate limiting helper
    async _rateLimit() {
      const now = Date.now()
      const timeSinceLastCall = now - this.lastApiCall
      
      if (timeSinceLastCall < this.minApiInterval) {
        const delay = this.minApiInterval - timeSinceLastCall
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      this.lastApiCall = Date.now()
    },

    // Enhanced API call wrapper with rate limiting and retry logic
    async _fetchWithErrorHandling(url: string, options?: RequestInit, retryCount = 0): Promise<any> {
      try {
        // Circuit breaker pattern - if too many consecutive failures, wait longer
        if (this.consecutiveFailures > 5) {
          const circuitBreakerDelay = Math.min(this.consecutiveFailures * 2000, 30000) // Max 30 seconds
          if (process.client) {
            console.log(`🚨 Circuit breaker active, waiting ${circuitBreakerDelay}ms`)
          }
          await new Promise(resolve => setTimeout(resolve, circuitBreakerDelay))
        }
        
        // Apply rate limiting
        await this._rateLimit()
        
        const response = await fetch(url, options)
        
        if (!response.ok) {
          this.consecutiveFailures++
          
          // Handle specific HTTP status codes
          switch (response.status) {
            case 404:
              throw new APIError('The requested data was not found. This could be because the data for this period is not yet available.', response.status, response.statusText)
            case 429:
              // Implement exponential backoff for rate limiting with more aggressive delays
              if (retryCount < 2) { // Reduced retry attempts
                const backoffDelay = Math.pow(3, retryCount + 1) * 1000 + Math.random() * 2000 // 3s, 9s + random
                if (process.client) {
                  console.log(`🔄 Rate limited, retrying in ${Math.round(backoffDelay)}ms (attempt ${retryCount + 1}/2)`)
                }
                await new Promise(resolve => setTimeout(resolve, backoffDelay))
                return this._fetchWithErrorHandling(url, options, retryCount + 1)
              }
              throw new APIError('Too many requests. The API is currently rate limiting requests. Please try again later.', response.status, response.statusText)
            case 502:
              throw new APIError('The police data service is currently experiencing issues. Please try again later.', response.status, response.statusText)
            default:
              throw new APIError(`API request failed: ${response.statusText}`, response.status, response.statusText)
          }
        }

        // Reset consecutive failures on successful request
        this.consecutiveFailures = 0
        
        return await response.json()
      } catch (error) {
        this.consecutiveFailures++
        
        if (error instanceof StopSearchError) {
          this._addError(error)
          throw error
        }
        
        // Handle network errors
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          const networkError = new NetworkError('Unable to connect to the police data service. Please check your internet connection.', error)
          this._addError(networkError)
          throw networkError
        }

        // Handle other unexpected errors
        const unexpectedError = new StopSearchError('An unexpected error occurred', 'UNEXPECTED_ERROR', error)
        this._addError(unexpectedError)
        throw unexpectedError
      }
    },

    // Fetch available datasets from the API
    async fetchAvailableDatasets() {
      try {
        // Check localStorage first
        const storedDatasets = localStorage.getItem('availableDatasets')
        const storedTimestamp = localStorage.getItem('availableDatasetsTimestamp')
        
        if (storedDatasets && storedTimestamp) {
          const timestamp = parseInt(storedTimestamp)
          // Use cached data if less than 24 hours old
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            this.availableDatasets = JSON.parse(storedDatasets)
            if (this.availableDatasets.length > 0) {
              this.latestAvailableDate = this.availableDatasets[0].date
              return this.availableDatasets
            }
          }
        }

        // Fetch fresh data if cache is expired or missing
        const response = await this._fetchWithErrorHandling('https://data.police.uk/api/crimes-street-dates')
        if (Array.isArray(response)) {
          this.availableDatasets = response.filter(dataset => 
            dataset.date && dataset['stop-and-search'] && dataset['stop-and-search'].length > 0
          )
          
          if (this.availableDatasets.length > 0) {
            this.latestAvailableDate = this.availableDatasets[0].date
          }

          // Cache the results
          localStorage.setItem('availableDatasets', JSON.stringify(this.availableDatasets))
          localStorage.setItem('availableDatasetsTimestamp', Date.now().toString())
          
          return this.availableDatasets
        }
        throw new APIError('Invalid response format from API', 500, 'Invalid Response')
      } catch (error) {
        if (error instanceof StopSearchError) {
          throw error
        }
        throw new StopSearchError('Failed to fetch available datasets', 'DATASET_FETCH_ERROR', error)
      }
    },

    // Check if a date has available stop and search data
    isDateAvailable(date: string): boolean {
      return this.availableDatasets.some(dataset => 
        dataset.date === date && dataset['stop-and-search']?.length > 0
      )
    },

    // Get the latest available date from the API
    async checkLatestAvailableDate() {
      if (this.isCheckingLatestDate) return this.latestAvailableDate
      
      try {
        this.isCheckingLatestDate = true
        await this.fetchAvailableDatasets()
        
        if (this.availableDatasets.length === 0) {
          throw new DateError('No data is currently available. Please try again later.')
        }
        
        return this.latestAvailableDate
      } catch (error) {
        if (error instanceof StopSearchError) {
          throw error
        }
        throw new DateError('Unable to determine the latest available date for stop and search data')
      } finally {
        this.isCheckingLatestDate = false
      }
    },

    // Get default date for API requests
    async getDefaultDate(): Promise<string> {
      return this.checkLatestAvailableDate()
    },

    // Get stops by area (1 mile radius)
    async getStopsByArea(lat: number, lng: number, date?: string) {
      try {
        const params: Record<string, string> = {
          lat: lat.toString(),
          lng: lng.toString()
        }
        // Only add date parameter if it's provided and not 'latest'
        if (date && date !== 'latest') {
          params.date = date
        }
        const cacheKey = this.getCacheKey(params)

        if (this.cache.area[cacheKey] && this.isCacheValid(cacheKey)) {
          return this.cache.area[cacheKey]
        }

        const queryParams = new URLSearchParams(params)
        const data = await this._fetchWithErrorHandling(`https://data.police.uk/api/stops-street?${queryParams}`)
        
        if (!Array.isArray(data)) {
          throw new APIError('Invalid response format from API', 500, 'Invalid Response')
        }
        
        this.setCacheData('area', cacheKey, data)
        return data
      } catch (error) {
        if (error instanceof StopSearchError) {
          throw error
        }
        throw new StopSearchError('Failed to fetch stop and search data for the specified area', 'AREA_SEARCH_ERROR', error)
      }
    },

    // Get stops by custom area
    async getStopsByCustomArea(points: [number, number][], date?: string) {
      const defaultDate = await this.getDefaultDate()
      const poly = points.map(([lat, lng]) => `${lat},${lng}`).join(':')
      const params = { poly, date: date || defaultDate }
      const cacheKey = this.getCacheKey(params)

      if (this.cache.customArea[cacheKey] && this.isCacheValid(cacheKey)) {
        return this.cache.customArea[cacheKey]
      }

      // Use POST for long polygons
      const method = poly.length > 4000 ? 'POST' : 'GET'
      const baseUrl = 'https://data.police.uk/api/stops-street'
      const queryParams = new URLSearchParams(params)
      
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }

      if (method === 'POST') {
        config.body = queryParams.toString()
      }

      const url = method === 'GET' ? `${baseUrl}?${queryParams}` : baseUrl
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      this.setCacheData('customArea', cacheKey, data)
      return data
    },

    // Get stops by location
    async getStopsByLocation(locationId: string, date?: string) {
      const defaultDate = await this.getDefaultDate()
      const params = { location_id: locationId, date: date || defaultDate }
      const cacheKey = this.getCacheKey(params)

      if (this.cache.location[cacheKey] && this.isCacheValid(cacheKey)) {
        return this.cache.location[cacheKey]
      }

      const queryParams = new URLSearchParams(params as any)
      const response = await fetch(`https://data.police.uk/api/stops-at-location?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      this.setCacheData('location', cacheKey, data)
      return data
    },

    // Get stops by force with enhanced caching for analytics
    async getStopsByForce(forceId: string, date?: string) {
      try {
        const params: Record<string, string> = { force: forceId }
        // Only add date parameter if it's provided and not 'latest'
        if (date && date !== 'latest') {
          params.date = date
        }
        const cacheKey = this.getCacheKey(params)

        // Check server cache first, then client cache
        const cachedData = await this.getCachedData(cacheKey, 'force')
        if (cachedData) {
          // Ensure force information is present in cached data
          return cachedData.map(incident => ({
            ...incident,
            force_id: incident.force_id || forceId,
            force_name: incident.force_name || this.forces.find(f => f.id === forceId)?.name || forceId
          }))
        }

        // Check if we have stale cache data and return it if API fails
        const staleData = this.cache.force[cacheKey]
        const isStale = staleData && (Date.now() - (this.cacheTimes[cacheKey] || 0)) < (this.cacheTimeout * 3) // Allow 3x timeout for stale data (90 days)

        // Fetch data from API
        if (process.client) {
          console.log(`🌐 Fetching data for force ${forceId} (${date || 'latest'})`)
        }
        
        try {
          const queryParams = new URLSearchParams(params)
          const data = await this._fetchWithErrorHandling(`https://data.police.uk/api/stops-force?${queryParams}`)
          
          if (!Array.isArray(data)) {
            throw new APIError('Invalid response format from API', 500, 'Invalid Response')
          }

          // Add force information to each incident
          const enhancedData = data.map(incident => ({
            ...incident,
            force_id: forceId,
            force_name: this.forces.find(f => f.id === forceId)?.name || forceId
          }))
          
          // Cache the results (server + client)
          await this.saveCachedData(cacheKey, enhancedData, 'force')
          
          if (process.client) {
            console.log(`💾 Cached ${enhancedData.length} incidents for ${forceId} (${date || 'latest'})`)
          }
          
          return enhancedData
        } catch (apiError) {
          // If API fails and we have stale data, return it
          if (isStale && staleData) {
            if (process.client) {
              console.log(`⚠️ API failed, using stale cached data for force ${forceId} (${date || 'latest'})`)
            }
            // Ensure force information is present in stale data
            return staleData.map(incident => ({
              ...incident,
              force_id: incident.force_id || forceId,
              force_name: incident.force_name || this.forces.find(f => f.id === forceId)?.name || forceId
            }))
          }
          throw apiError
        }
      } catch (error) {
        if (error instanceof StopSearchError) {
          throw error
        }
        throw new StopSearchError(`Failed to fetch stop and search data for force ${forceId}`, 'FORCE_SEARCH_ERROR', error)
      }
    },

    // Clear expired cache entries
    clearExpiredCache() {
      const now = Date.now()
      let hasChanges = false
      let clearedCount = 0
      
      const entries = Object.entries(this.cacheTimes) as [string, number][]
      entries.forEach(([key, timestamp]) => {
        const age = now - timestamp
        if (age >= this.cacheTimeout) {
          delete this.cacheTimes[key]
          Object.values(this.cache as Record<string, Record<string, StopSearchIncident[]>>).forEach(cache => {
            delete cache[key]
          })
          hasChanges = true
          clearedCount++
        }
      })

      if (hasChanges) {
        if (process.client) {
          console.log(`🗑️ Cleared ${clearedCount} expired cache entries`)
        }
        this.saveToStorage()
      }
    },

    // Get stops by visible area using polygon
    async getStopsByViewport(bounds: L.LatLngBounds, date?: string) {
      try {
        // Create polygon points from bounds
        const points = [
          [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
          [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
          [bounds.getSouthEast().lat, bounds.getSouthEast().lng],
          [bounds.getSouthWest().lat, bounds.getSouthWest().lng]
        ]
        
        const poly = points.map(([lat, lng]) => `${lat},${lng}`).join(':')
        const params: Record<string, string> = { poly }
        
        // Only add date parameter if it's provided and not 'latest'
        if (date && date !== 'latest') {
          params.date = date
        }

        const cacheKey = this.getCacheKey(params)

        if (this.cache.area[cacheKey] && this.isCacheValid(cacheKey)) {
          return this.cache.area[cacheKey]
        }

        const queryParams = new URLSearchParams(params)
        const data = await this._fetchWithErrorHandling(`https://data.police.uk/api/stops-street?${queryParams}`)
        
        if (!Array.isArray(data)) {
          throw new APIError('Invalid response format from API', 500, 'Invalid Response')
        }
        
        this.setCacheData('area', cacheKey, data)
        return data
      } catch (error) {
        if (error instanceof StopSearchError) {
          throw error
        }
        throw new StopSearchError('Failed to fetch stop and search data for the specified area', 'AREA_SEARCH_ERROR', error)
      }
    },
  }
})

// Remove the initialization code that was causing the error
// if (typeof window !== 'undefined') {
//   const store = useStopSearchStore()
//   store.initializeFromStorage()
// } 