import { defineEventHandler, createError } from 'h3'

// Cache for forces data (in-memory cache for development)
let forcesCache: any[] = []
let forceDetailsCache: Record<string, any> = {}
let lastFetch = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export default defineEventHandler(async (event) => {
  const now = Date.now()
  
  // Return cached data if it's still fresh
  if (forcesCache.length > 0 && (now - lastFetch) < CACHE_DURATION) {
    return {
      forces: forcesCache,
      forceDetails: forceDetailsCache,
      cached: true,
      lastUpdated: new Date(lastFetch).toISOString()
    }
  }
  
  try {
    // Fetch forces list
    const forcesResponse = await fetch('https://data.police.uk/api/forces')
    if (!forcesResponse.ok) {
      throw new Error('Failed to fetch forces list')
    }
    const forces = await forcesResponse.json()
    
    // Fetch details for each force (limit to first 10 for performance)
    const forceDetails: Record<string, any> = {}
    const forcesToFetch = forces.slice(0, 10) // Limit to prevent API overload
    
    for (const force of forcesToFetch) {
      try {
        const detailsResponse = await fetch(`https://data.police.uk/api/forces/${force.id}`)
        if (detailsResponse.ok) {
          const details = await detailsResponse.json()
          forceDetails[force.id] = details
        }
        // Add small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error fetching details for force ${force.id}:`, error)
      }
    }
    
    // Update cache
    forcesCache = forces
    forceDetailsCache = forceDetails
    lastFetch = now
    
    return {
      forces,
      forceDetails,
      cached: false,
      lastUpdated: new Date(now).toISOString()
    }
  } catch (error) {
    console.error('Error fetching forces data:', error)
    
    // Return cached data if available, even if stale
    if (forcesCache.length > 0) {
      return {
        forces: forcesCache,
        forceDetails: forceDetailsCache,
        cached: true,
        stale: true,
        lastUpdated: new Date(lastFetch).toISOString(),
        error: 'Using cached data due to API error'
      }
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch forces data'
    })
  }
})
