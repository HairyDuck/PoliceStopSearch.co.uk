import { defineEventHandler, createError } from 'h3'

// Cache for forces data (in-memory cache for development)
let forcesCache: any[] = []
let forceDetailsCache: Record<string, any> = {}
let lastFetch = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export default defineEventHandler(async (event) => {
  const now = Date.now()
  
  // Check if we're in build mode (prerendering) or if external APIs are unavailable
  const isBuildMode = process.env.NODE_ENV === 'production' && process.env.NITRO_PRESET === 'static'
  const isPrerendering = process.env.NITRO_PRESET === 'static'
  
  if (isBuildMode || isPrerendering) {
    // Return fallback data for build time
    const fallbackData = {
      forces: [
        { id: 'avon-and-somerset', name: 'Avon and Somerset Police' },
        { id: 'bedfordshire', name: 'Bedfordshire Police' },
        { id: 'cambridgeshire', name: 'Cambridgeshire Police' },
        { id: 'cheshire', name: 'Cheshire Police' },
        { id: 'city-of-london', name: 'City of London Police' },
        { id: 'cleveland', name: 'Cleveland Police' },
        { id: 'cumbria', name: 'Cumbria Police' },
        { id: 'derbyshire', name: 'Derbyshire Police' },
        { id: 'devon-and-cornwall', name: 'Devon and Cornwall Police' },
        { id: 'dorset', name: 'Dorset Police' },
        { id: 'durham', name: 'Durham Police' },
        { id: 'dyfed-powys', name: 'Dyfed-Powys Police' },
        { id: 'essex', name: 'Essex Police' },
        { id: 'gloucestershire', name: 'Gloucestershire Police' },
        { id: 'greater-manchester', name: 'Greater Manchester Police' },
        { id: 'gwent', name: 'Gwent Police' },
        { id: 'hampshire', name: 'Hampshire Police' },
        { id: 'hertfordshire', name: 'Hertfordshire Police' },
        { id: 'kent', name: 'Kent Police' },
        { id: 'lancashire', name: 'Lancashire Police' },
        { id: 'leicestershire', name: 'Leicestershire Police' },
        { id: 'merseyside', name: 'Merseyside Police' },
        { id: 'metropolitan', name: 'Metropolitan Police' },
        { id: 'norfolk', name: 'Norfolk Police' },
        { id: 'north-wales', name: 'North Wales Police' },
        { id: 'north-yorkshire', name: 'North Yorkshire Police' },
        { id: 'northamptonshire', name: 'Northamptonshire Police' },
        { id: 'northumbria', name: 'Northumbria Police' },
        { id: 'nottinghamshire', name: 'Nottinghamshire Police' },
        { id: 'south-wales', name: 'South Wales Police' },
        { id: 'south-yorkshire', name: 'South Yorkshire Police' },
        { id: 'staffordshire', name: 'Staffordshire Police' },
        { id: 'suffolk', name: 'Suffolk Police' },
        { id: 'surrey', name: 'Surrey Police' },
        { id: 'sussex', name: 'Sussex Police' },
        { id: 'thames-valley', name: 'Thames Valley Police' },
        { id: 'warwickshire', name: 'Warwickshire Police' },
        { id: 'west-mercia', name: 'West Mercia Police' },
        { id: 'west-midlands', name: 'West Midlands Police' },
        { id: 'west-yorkshire', name: 'West Yorkshire Police' },
        { id: 'wiltshire', name: 'Wiltshire Police' }
      ],
      forceDetails: {},
      cached: false,
      lastUpdated: new Date(now).toISOString(),
      fallback: true
    }
    
    // Cache the fallback data
    forcesCache = fallbackData.forces
    forceDetailsCache = fallbackData.forceDetails
    lastFetch = now
    
    return fallbackData
  }
  
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
