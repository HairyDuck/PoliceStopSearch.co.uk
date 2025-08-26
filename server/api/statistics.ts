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
  
  // Check if we're in build mode (prerendering) or if external APIs are unavailable
  const isBuildMode = process.env.NODE_ENV === 'production' && process.env.NITRO_PRESET === 'static'
  const isPrerendering = process.env.NITRO_PRESET === 'static'
  
  if (isBuildMode || isPrerendering) {
    // Return fallback data for build time
    const fallbackData = {
      statistics: {
        totalSearches: 0,
        arrests: 0,
        noFurtherAction: 0,
        outcomes: {},
        ethnicityBreakdown: {},
        ethnicityOutcomes: {},
        objectsOfSearch: {},
        genderBreakdown: {},
        ageBreakdown: {},
        mostCommonObject: 'None',
        mostCommonObjectCount: 0,
        latestMonth: '2025-01',
        availableMonths: ['2025-01', '2024-12', '2024-11'],
        forcesAnalyzed: 0,
        totalForces: 44
      },
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
      availableDatasets: [
        { date: '2025-01', 'stop-and-search': ['avon-and-somerset', 'bedfordshire'] },
        { date: '2024-12', 'stop-and-search': ['avon-and-somerset', 'bedfordshire'] },
        { date: '2024-11', 'stop-and-search': ['avon-and-somerset', 'bedfordshire'] }
      ],
      cached: false,
      lastUpdated: new Date(now).toISOString(),
      fallback: true
    }
    
    // Cache the fallback data
    statisticsCache = {
      data: fallbackData.statistics,
      forces: fallbackData.forces,
      availableDatasets: fallbackData.availableDatasets
    }
    lastFetch = now
    
    return fallbackData
  }
  
  try {
    // Fetch available datasets to get the latest month
    let datesResponse
    try {
      datesResponse = await fetch('https://data.police.uk/api/crimes-street-dates', {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
    } catch (fetchError) {
      console.warn('Failed to fetch dates from police API, using fallback data')
      // Return fallback data for build time
      const fallbackData = {
        statistics: {
          totalSearches: 0,
          arrests: 0,
          noFurtherAction: 0,
          outcomes: {},
          ethnicityBreakdown: {},
          ethnicityOutcomes: {},
          objectsOfSearch: {},
          genderBreakdown: {},
          ageBreakdown: {},
          mostCommonObject: 'None',
          mostCommonObjectCount: 0,
          latestMonth: '2025-01',
          availableMonths: ['2025-01', '2024-12', '2024-11'],
          forcesAnalyzed: 0,
          totalForces: 44
        },
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
        availableDatasets: [
          { date: '2025-01', 'stop-and-search': ['avon-and-somerset', 'bedfordshire'] },
          { date: '2024-12', 'stop-and-search': ['avon-and-somerset', 'bedfordshire'] },
          { date: '2024-11', 'stop-and-search': ['avon-and-somerset', 'bedfordshire'] }
        ],
        cached: false,
        lastUpdated: new Date(now).toISOString(),
        fallback: true
      }
      
      // Cache the fallback data
      statisticsCache = {
        data: fallbackData.statistics,
        forces: fallbackData.forces,
        availableDatasets: fallbackData.availableDatasets
      }
      lastFetch = now
      
      return fallbackData
    }
    
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
    let forcesResponse
    try {
      forcesResponse = await fetch('https://data.police.uk/api/forces', {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
    } catch (fetchError) {
      console.warn('Failed to fetch forces from police API, using fallback data')
      // Return fallback data for build time
      const fallbackData = {
        statistics: {
          totalSearches: 0,
          arrests: 0,
          noFurtherAction: 0,
          outcomes: {},
          ethnicityBreakdown: {},
          ethnicityOutcomes: {},
          objectsOfSearch: {},
          genderBreakdown: {},
          ageBreakdown: {},
          mostCommonObject: 'None',
          mostCommonObjectCount: 0,
          latestMonth: '2025-01',
          availableMonths: ['2025-01', '2024-12', '2024-11'],
          forcesAnalyzed: 0,
          totalForces: 44
        },
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
        availableDatasets: [
          { date: '2025-01', 'stop-and-search': ['avon-and-somerset', 'bedfordshire'] },
          { date: '2024-12', 'stop-and-search': ['avon-and-somerset', 'bedfordshire'] },
          { date: '2024-11', 'stop-and-search': ['avon-and-somerset', 'bedfordshire'] }
        ],
        cached: false,
        lastUpdated: new Date(now).toISOString(),
        fallback: true
      }
      
      // Cache the fallback data
      statisticsCache = {
        data: fallbackData.statistics,
        forces: fallbackData.forces,
        availableDatasets: fallbackData.availableDatasets
      }
      lastFetch = now
      
      return fallbackData
    }
    
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
