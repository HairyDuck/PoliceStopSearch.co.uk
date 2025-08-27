import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Force coordinates (approximate centers of UK police force areas)
    const forceCoordinates: Record<string, [number, number]> = {
      'avon-and-somerset': [51.4545, -2.5879],
      'bedfordshire': [52.1364, -0.4661],
      'cambridgeshire': [52.2053, 0.1218],
      'cheshire': [53.1910, -2.5879],
      'city-of-london': [51.5136, -0.0984],
      'cleveland': [54.5260, -1.2346],
      'cumbria': [54.5772, -2.7975],
      'derbyshire': [53.1333, -1.5333],
      'devon-and-cornwall': [50.3755, -4.1427],
      'dorset': [50.7488, -2.3445],
      'durham': [54.7761, -1.5733],
      'dyfed-powys': [52.1307, -4.2763],
      'essex': [51.7500, 0.5000],
      'gloucestershire': [51.8642, -2.2380],
      'greater-manchester': [53.4808, -2.2426],
      'gwent': [51.6214, -3.9436],
      'hampshire': [50.9097, -1.4044],
      'hertfordshire': [51.8098, -0.2377],
      'humberside': [53.7443, -0.3325],
      'kent': [51.2787, 0.5217],
      'lancashire': [53.7632, -2.7039],
      'leicestershire': [52.6369, -1.1398],
      'lincolnshire': [53.2307, -0.5406],
      'merseyside': [53.4084, -2.9916],
      'metropolitan': [51.5074, -0.1278],
      'norfolk': [52.6143, 0.8888],
      'north-wales': [53.1404, -3.7837],
      'north-yorkshire': [54.0000, -1.5000],
      'northamptonshire': [52.2333, -0.9000],
      'northern-ireland': [54.7877, -6.4923],
      'northumbria': [54.9783, -1.6178],
      'nottinghamshire': [53.0000, -1.0000],
      'police-scotland': [55.9533, -3.1883],
      'psni': [54.7877, -6.4923],
      'south-wales': [51.4816, -3.1791],
      'south-yorkshire': [53.3811, -1.4701],
      'staffordshire': [52.8833, -2.1333],
      'suffolk': [52.1872, 0.9708],
      'surrey': [51.2362, -0.5704],
      'sussex': [50.8225, -0.1372],
      'thames-valley': [51.4543, -0.9781],
      'warwickshire': [52.2823, -1.5849],
      'west-mercia': [52.1916, -2.2215],
      'west-midlands': [52.4862, -1.8904],
      'west-yorkshire': [53.8008, -1.5491],
      'wiltshire': [51.3498, -1.9941]
    }

    // Determine base URL for API calls
    const isDev = process.env.NODE_ENV === 'development'
    const baseURL = isDev ? 'http://localhost:8000' : 'https://api.policestopsearch.co.uk'
    
    // Load police forces data from local file
    const policeForcesPath = join(process.cwd(), 'police_forces.json')
    const forcesResponse = JSON.parse(readFileSync(policeForcesPath, 'utf8'))
    
    // Load transparency analysis
    let transparencyResponse: {forcesWithIssues: string[], analysis: any} = { forcesWithIssues: [], analysis: {} }
    try {
      transparencyResponse = await $fetch<{forcesWithIssues: string[], analysis: any}>(`${baseURL}/transparency-analysis.php`)
    } catch (err) {
      console.warn('Could not load transparency analysis, using fallback')
    }
    
    // If we're in development and the PHP server isn't running, provide fallback data
    if (isDev && Object.keys(forcesResponse).length > 0) {
      console.log('🔧 Development mode: Using fallback data for HomePageMap')
      
      // Create fallback data for development
      const fallbackForces = Object.entries(forcesResponse).map(([forceId, forceInfo]: [string, any]) => {
        const coordinates = forceCoordinates[forceId]
        return {
          id: forceId,
          name: forceInfo.name,
          status: 'active' as const,
          latestMonth: '2024-12',
          totalIncidents: Math.floor(Math.random() * 1000) + 100,
          coordinates,
          hasTransparencyIssues: false
        }
      })
      
      const summary = {
        totalForces: fallbackForces.length,
        activeForces: fallbackForces.length,
        limitedDataForces: 0,
        noDataForces: 0,
        transparencyIssues: 0,
        latestMonth: '2024-12'
      }
      
      return {
        success: true,
        summary,
        forces: fallbackForces,
        timestamp: new Date().toISOString()
      }
    }
    
    // Load latest statistics for each force
    const forcesWithData: any[] = []
    const forcesWithIssues = new Set(transparencyResponse.forcesWithIssues || [])
    
    let latestMonth = 'Unknown'
    let activeCount = 0
    let limitedCount = 0
    let noDataCount = 0

    // Process each force
    for (const [forceId, forceInfo] of Object.entries(forcesResponse as Record<string, any>)) {
      const forceName = forceInfo.name
      const coordinates = forceCoordinates[forceId]
      
             // Check if force has transparency issues
       const hasIssues = forcesWithIssues.has(forceId)
       
       // Try to get latest data for this force
       let latestData: any = null
       let status: 'active' | 'limited' | 'none' = 'none'
       let latestMonthForForce: string | null = null
       let totalIncidents = 0

       try {
         // Use the correct API endpoint
         const dataResponse = await $fetch(`${baseURL}/force-data.php?force=${forceId}`)
         if (dataResponse && (dataResponse as any).total > 0) {
           latestData = dataResponse
           totalIncidents = (dataResponse as any).total
           latestMonthForForce = (dataResponse as any).month || 'Latest'
           
           if (totalIncidents > 100) {
             status = 'active'
             activeCount++
           } else {
             status = 'limited'
             limitedCount++
           }
         } else {
           // If force has transparency issues, mark as no data
           if (hasIssues) {
             status = 'none'
             noDataCount++
           } else {
             status = 'limited'
             limitedCount++
           }
         }
       } catch (err) {
         console.warn(`Could not load data for ${forceId}:`, err)
         status = 'none'
         noDataCount++
       }

             forcesWithData.push({
         id: forceId,
         name: forceName,
         status,
         latestMonth: latestMonthForForce,
         totalIncidents,
         coordinates,
         hasTransparencyIssues: hasIssues
       })

      // Update latest month if we found more recent data
      if (latestMonthForForce && latestMonthForForce !== 'Latest') {
        if (latestMonth === 'Unknown' || latestMonthForForce > latestMonth) {
          latestMonth = latestMonthForForce
        }
      }
    }

    // Sort forces by status (active first, then limited, then none)
    const sortedForces = forcesWithData.sort((a, b) => {
      const statusOrder = { active: 0, limited: 1, none: 2 }
      return statusOrder[a.status] - statusOrder[b.status]
    })

    // Create summary
    const summary = {
      totalForces: forcesWithData.length,
      activeForces: activeCount,
      limitedDataForces: limitedCount,
      noDataForces: noDataCount,
      transparencyIssues: forcesWithIssues.size,
      latestMonth
    }

    return {
      success: true,
      summary,
      forces: sortedForces,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('Error in homepage-map API:', error)
    
    // Return fallback data
    return {
      success: false,
      error: 'Failed to load police force data',
      summary: {
        totalForces: 0,
        activeForces: 0,
        limitedDataForces: 0,
        noDataForces: 0,
        transparencyIssues: 0,
        latestMonth: 'Unknown'
      },
      forces: [],
      timestamp: new Date().toISOString()
    }
  }
})
