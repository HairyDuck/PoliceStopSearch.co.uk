import { defineEventHandler, createError } from 'h3'

// Cache for statistics data
let statisticsCache: any = {}
let lastFetch = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export default defineEventHandler(async (event) => {
  const now = Date.now()
  
  // Return cached data if it's still fresh
  if (statisticsCache.data && (now - lastFetch) < CACHE_DURATION) {
    return {
      ...statisticsCache,
      cached: true,
      lastUpdated: new Date(lastFetch).toISOString()
    }
  }
  
  try {
    // Fetch available datasets to get the latest month
    const datesResponse = await fetch('https://data.police.uk/api/crimes-street-dates')
    if (!datesResponse.ok) {
      throw new Error('Failed to fetch available dates')
    }
    const dates = await datesResponse.json()
    
    // Filter for datasets with stop and search data
    const availableDatasets = dates.filter((dataset: any) => 
      dataset.date && dataset['stop-and-search'] && dataset['stop-and-search'].length > 0
    )
    
    if (availableDatasets.length === 0) {
      throw new Error('No stop and search data available')
    }
    
    // Get the latest available month
    const latestMonth = availableDatasets[0].date
    
    // Fetch forces list
    const forcesResponse = await fetch('https://data.police.uk/api/forces')
    if (!forcesResponse.ok) {
      throw new Error('Failed to fetch forces list')
    }
    const forces = await forcesResponse.json()
    
    // Fetch sample statistics for the latest month (limit to first 5 forces for performance)
    const sampleForces = forces.slice(0, 5)
    const statistics = {
      totalSearches: 0,
      arrests: 0,
      noFurtherAction: 0,
      outcomes: {} as Record<string, number>,
      ethnicityBreakdown: {} as Record<string, number>,
      ethnicityOutcomes: {} as Record<string, { arrests: number, noAction: number }>,
      objectsOfSearch: {} as Record<string, number>,
      genderBreakdown: {} as Record<string, number>,
      ageBreakdown: {} as Record<string, number>,
      mostCommonObject: 'None',
      mostCommonObjectCount: 0,
      latestMonth,
      availableMonths: availableDatasets.map((d: any) => d.date).slice(0, 12), // Last 12 months
      forcesAnalyzed: sampleForces.length,
      totalForces: forces.length
    }
    
    // Fetch sample data for each force
    for (const force of sampleForces) {
      try {
        const forceResponse = await fetch(`https://data.police.uk/api/stops-force?force=${force.id}&date=${latestMonth}`)
        if (forceResponse.ok) {
          const forceData = await forceResponse.json()
          
          // Process the data
          forceData.forEach((incident: any) => {
            statistics.totalSearches++
            
            // Count outcomes
            const outcome = incident.outcome || 'Unknown'
            statistics.outcomes[outcome] = (statistics.outcomes[outcome] || 0) + 1
            
            if (outcome.includes('Arrest')) {
              statistics.arrests++
            } else if (outcome.includes('No further action')) {
              statistics.noFurtherAction++
            }
            
            // Count ethnicity
            const ethnicity = incident.officer_defined_ethnicity || 'Unknown'
            statistics.ethnicityBreakdown[ethnicity] = (statistics.ethnicityBreakdown[ethnicity] || 0) + 1
            
            // Count gender
            const gender = incident.gender || 'Unknown'
            statistics.genderBreakdown[gender] = (statistics.genderBreakdown[gender] || 0) + 1
            
            // Count age
            const age = incident.age_range || 'Unknown'
            statistics.ageBreakdown[age] = (statistics.ageBreakdown[age] || 0) + 1
            
            // Count objects of search
            const object = incident.object_of_search || 'None'
            statistics.objectsOfSearch[object] = (statistics.objectsOfSearch[object] || 0) + 1
          })
        }
        
        // Add small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error fetching data for force ${force.id}:`, error)
      }
    }
    
    // Calculate most common object
    const objectEntries = Object.entries(statistics.objectsOfSearch)
    if (objectEntries.length > 0) {
      const [mostCommon, count] = objectEntries.reduce((a, b) => a[1] > b[1] ? a : b)
      statistics.mostCommonObject = mostCommon
      statistics.mostCommonObjectCount = count
    }
    
    // Update cache
    statisticsCache = {
      data: statistics,
      forces: forces,
      availableDatasets
    }
    lastFetch = now
    
    return {
      statistics: statistics,
      forces: forces,
      availableDatasets,
      cached: false,
      lastUpdated: new Date(now).toISOString()
    }
  } catch (error) {
    console.error('Error fetching statistics data:', error)
    
    // Return cached data if available, even if stale
    if (statisticsCache.data) {
      return {
        ...statisticsCache,
        cached: true,
        stale: true,
        lastUpdated: new Date(lastFetch).toISOString(),
        error: 'Using cached data due to API error'
      }
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics data'
    })
  }
})
