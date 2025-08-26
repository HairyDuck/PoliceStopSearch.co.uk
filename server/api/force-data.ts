import { defineEventHandler, getQuery, createError } from 'h3'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Cache file path
const CACHE_FILE = path.join(process.cwd(), 'data', 'server-cache.json')

// Read cache data
async function readCache() {
  try {
    if (existsSync(CACHE_FILE)) {
      const data = await readFile(CACHE_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading cache:', error)
  }
  return {}
}

// Write cache data
async function writeCache(cache: any) {
  try {
    await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2))
  } catch (error) {
    console.error('Error writing cache:', error)
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { force, date } = query

  if (!force) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Force parameter is required'
    })
  }

  // Check if we're in build mode (prerendering) or if external APIs are unavailable
  const isBuildMode = process.env.NODE_ENV === 'production' && process.env.NITRO_PRESET === 'static'
  const isPrerendering = process.env.NITRO_PRESET === 'static'
  
  if (isBuildMode || isPrerendering) {
    // Return fallback data for build time
    const fallbackData = {
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
    
    return fallbackData
  }

  try {
    // Check if we have aggregated data in cache
    const cache = await readCache()
    const cacheKey = `aggregated:${force}:${date || 'latest'}`
    
    if (cache[cacheKey] && cache[cacheKey].data) {
      // Return aggregated data from cache
      return cache[cacheKey].data
    }

    // Try force-specific API first
    let rawData = []
    let dataSource = 'force-api'
    
    try {
      const forceUrl = `https://data.police.uk/api/stops-force?force=${force}${date ? `&date=${date}` : ''}`
      const response = await fetch(forceUrl)
      
      if (response.ok) {
        rawData = await response.json()
        console.log(`✅ Force API returned ${rawData.length} incidents for ${force}:${date}`)
      } else {
        console.log(`⚠️ Force API failed for ${force}:${date}, trying boundary fallback`)
        dataSource = 'boundary-fallback'
      }
    } catch (error) {
      console.log(`⚠️ Force API error for ${force}:${date}, trying boundary fallback`)
      dataSource = 'boundary-fallback'
    }

    // If force API failed or returned no data, try boundary fallback
    if (rawData.length === 0) {
      try {
        rawData = await fetchDataByBoundary(force, date)
        dataSource = 'boundary-fallback'
        console.log(`✅ Boundary fallback returned ${rawData.length} incidents for ${force}:${date}`)
      } catch (boundaryError) {
        console.error(`❌ Boundary fallback also failed for ${force}:${date}`, boundaryError)
        // Return empty data structure
        const emptyAggregated = aggregateStopSearchData([])
        emptyAggregated.forceId = force
        emptyAggregated.forceName = force
        emptyAggregated.month = date || ''
        return emptyAggregated
      }
    }

    // Enhance the data with force information
    const enhancedData = rawData.map((incident: any) => ({
      ...incident,
      force_id: force,
      force_name: incident.force_name || force
    }))

    // Aggregate the data immediately
    const aggregated = aggregateStopSearchData(enhancedData)
    
    // Cache the aggregated data (not the raw data)
    cache[cacheKey] = {
      data: aggregated,
      timestamp: Date.now(),
      ttl: 7776000000, // 90 days
      source: dataSource
    }
    await writeCache(cache)

    // Return the aggregated data
    return aggregated
  } catch (error) {
    console.error(`Error fetching data for force ${force}:`, error)
    
    throw createError({
      statusCode: 503,
      statusMessage: `Failed to fetch data for force ${force}`
    })
  }
})

// Fetch data using boundary polygon as fallback
async function fetchDataByBoundary(force: string, date?: string) {
  try {
    // Load the force boundary from GeoJSON file
    const boundaryPath = path.join(process.cwd(), 'public', 'data', 'simplified', `${force}.geojson`)
    
    if (!existsSync(boundaryPath)) {
      console.log(`⚠️ No boundary file found for ${force}`)
      return []
    }

    const boundaryFileData = await readFile(boundaryPath, 'utf-8')
    const boundary = JSON.parse(boundaryFileData)
    
    // Extract coordinates from the boundary
    let coordinates: number[][] = []
    
    if (boundary.features && boundary.features.length > 0) {
      const geometry = boundary.features[0].geometry
      if (geometry.type === 'Polygon') {
        coordinates = geometry.coordinates[0] // First ring of the polygon
      } else if (geometry.type === 'MultiPolygon') {
        coordinates = geometry.coordinates[0][0] // First polygon, first ring
      }
    }

    if (coordinates.length === 0) {
      console.log(`⚠️ No valid coordinates found in boundary for ${force}`)
      return []
    }

    // Create polygon string for API query
    const polygonString = coordinates.map(coord => `${coord[1]},${coord[0]}`).join(':')
    
    // Fetch data using the polygon
    const boundaryUrl = `https://data.police.uk/api/stops-street?poly=${encodeURIComponent(polygonString)}${date ? `&date=${date}` : ''}`
    
    console.log(`🔍 Fetching boundary data for ${force} using polygon`)
    
    const response = await fetch(boundaryUrl)
    
    if (!response.ok) {
      throw new Error(`Boundary API returned ${response.status}: ${response.statusText}`)
    }

    const apiData = await response.json()
    
    // Filter data to only include incidents from the specific force (if possible)
    // Note: The boundary API might return data from multiple forces in the area
    const filteredData = apiData.filter((incident: any) => {
      // If the incident has force information, filter by it
      if (incident.force_name) {
        return incident.force_name.toLowerCase().includes(force.toLowerCase())
      }
      // Otherwise, include all data from the boundary (less precise but better than nothing)
      return true
    })

    return filteredData
  } catch (error) {
    console.error(`Error fetching boundary data for ${force}:`, error)
    throw error
  }
}

// Aggregation function (same as in store)
function aggregateStopSearchData(incidents: any[]) {
  const aggregated = {
    total: incidents.length,
    arrests: 0,
    noAction: 0,
    warnings: 0,
    other: 0,
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
}
