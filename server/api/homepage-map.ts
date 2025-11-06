

export default defineEventHandler(async (event) => {
  // Set cache headers - shorter cache time to allow updates
  setHeader(event, 'Cache-Control', 'public, max-age=3600') // 1 hour
  
  try {
    // Determine base URL for API calls
    const isDev = process.env.NODE_ENV === 'development'
    const baseURL = isDev ? 'http://localhost:8000' : 'https://api.policestopsearch.co.uk'
    
    // Fetch data from the PHP API endpoint (with cache busting)
    const response = await $fetch<{
      success: boolean
      summary?: {
        totalForces: number
        activeForces: number
        limitedDataForces: number
        noDataForces: number
        transparencyIssues: number
        latestMonth: string
      }
      forces?: Array<{
        id: string
        name: string
        status: 'active' | 'limited' | 'none'
        latestMonth: string | null
        totalIncidents: number
        coordinates?: [number, number]
        hasTransparencyIssues: boolean
      }>
      error?: string
    }>(`${baseURL}/homepage-map.php`)
    
    if (response.success && response.summary && response.forces) {
      console.log('📁 Successfully loaded homepage data from PHP API')
      return {
        success: true,
        summary: response.summary,
        forces: response.forces,
        timestamp: new Date().toISOString()
      }
    } else {
      console.log('❌ Failed to load homepage data:', response.error)
      return {
        success: false,
        error: response.error || 'Failed to load police force data',
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

  } catch (error) {
    console.error('Error in homepage-map API:', error)
    
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
