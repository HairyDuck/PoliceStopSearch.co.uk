import { defineStore } from 'pinia'
import { format, subMonths } from 'date-fns'

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
    cacheTimeout: 5 * 60 * 1000,        // Cache timeout (5 minutes)
    cacheTimes: {} as { [key: string]: number }, // Timestamp for each cache entry
    latestAvailableDate: format(subMonths(new Date(), 1), 'yyyy-MM'), // Default to previous month
    isCheckingLatestDate: false,
    errors: [] as StopSearchError[], // Track recent errors
    maxErrors: 10, // Maximum number of errors to keep
    availableDatasets: [] as AvailableDataset[], // Available datasets from API
  }),

  actions: {
    // Load data from localStorage on initialization
    initializeFromStorage() {
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
          this.clearExpiredCache() // Clean up any expired entries
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
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
        // More aggressive cache management - limit items per mode
        const maxCacheItemsPerMode = 20 // Reduced from 50
        const maxTotalSize = 4.5 * 1024 * 1024 // 4.5MB limit (localStorage typically has 5MB)
        
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

    // Check if cache is valid
    isCacheValid(key: string): boolean {
      const timestamp = this.cacheTimes[key]
      if (!timestamp) return false
      return Date.now() - timestamp < this.cacheTimeout
    },

    // Cache data with timestamp
    setCacheData(mode: 'area' | 'location' | 'force' | 'customArea', key: string, data: StopSearchIncident[]) {
      this.cache[mode][key] = data
      this.cacheTimes[key] = Date.now()
      this.saveToStorage()
    },

    // Load forces if not already loaded
    async loadForces() {
      if (this.forces.length === 0) {
        try {
          const response = await fetch('https://data.police.uk/api/forces')
          this.forces = await response.json()
          // Cache forces in localStorage
          localStorage.setItem('forces', JSON.stringify(this.forces))
        } catch (error) {
          // If API fails, try to load from localStorage
          const storedForces = localStorage.getItem('forces')
          if (storedForces) {
            this.forces = JSON.parse(storedForces)
          } else {
            throw error
          }
        }
      }
      return this.forces
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

    // Enhanced API call wrapper
    async _fetchWithErrorHandling(url: string, options?: RequestInit): Promise<any> {
      try {
        const response = await fetch(url, options)
        
        if (!response.ok) {
          // Handle specific HTTP status codes
          switch (response.status) {
            case 404:
              throw new APIError('The requested data was not found. This could be because the data for this period is not yet available.', response.status, response.statusText)
            case 429:
              throw new APIError('Too many requests. Please try again later.', response.status, response.statusText)
            case 502:
              throw new APIError('The police data service is currently experiencing issues. Please try again later.', response.status, response.statusText)
            default:
              throw new APIError(`API request failed: ${response.statusText}`, response.status, response.statusText)
          }
        }

        return await response.json()
      } catch (error) {
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

    // Get stops by force
    async getStopsByForce(forceId: string, date?: string) {
      try {
        const params: Record<string, string> = { force: forceId }
        // Only add date parameter if it's provided and not 'latest'
        if (date && date !== 'latest') {
          params.date = date
        }
        const cacheKey = this.getCacheKey(params)

        // Check cache first
        if (this.cache.force[cacheKey] && this.isCacheValid(cacheKey)) {
          return this.cache.force[cacheKey]
        }

        // Fetch data from API
        const queryParams = new URLSearchParams(params)
        const data = await this._fetchWithErrorHandling(`https://data.police.uk/api/stops-force?${queryParams}`)
        
        if (!Array.isArray(data)) {
          throw new APIError('Invalid response format from API', 500, 'Invalid Response')
        }

        // Cache the results
        this.setCacheData('force', cacheKey, data)
        return data
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
      
      const entries = Object.entries(this.cacheTimes) as [string, number][]
      entries.forEach(([key, timestamp]) => {
        if (now - timestamp >= this.cacheTimeout) {
          delete this.cacheTimes[key]
          Object.values(this.cache as Record<string, Record<string, StopSearchIncident[]>>).forEach(cache => {
            delete cache[key]
          })
          hasChanges = true
        }
      })

      if (hasChanges) {
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