export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { force, month = 'latest' } = query
  
  try {
    // Build the URL for the external API
    let url = 'https://api.policestopsearch.co.uk/statistics-cache.php?action=get'
    if (force) {
      url += `&force=${force}`
    }
    if (month && month !== 'latest') {
      url += `&month=${month}`
    }
    
    // Fetch data from the external API
    const response = await $fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PoliceStopSearch-Proxy/1.0'
      },
      timeout: 10000
    })
    
    // Return the data
    return response
  } catch (error) {
    console.error('Proxy statistics API error:', error)
    
    // Return fallback data
    return {
      cached: false,
      data: {
        total_incidents: 0,
        total_arrests: 0,
        total_no_further_action: 0,
        forces_analyzed: 0,
        month: month || 'latest',
        overall_breakdowns: {
          outcomes: {},
          ethnicity: {},
          gender: {},
          age: {},
          objectOfSearch: {},
          legislation: {},
          byHour: {},
          byDay: {}
        }
      }
    }
  }
})
