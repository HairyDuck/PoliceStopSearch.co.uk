import { useStopSearchStore } from '@/stores/stopsearch'

/**
 * Composable for background data refresh
 * Implements stale-while-revalidate pattern to ensure users always see latest data
 */
export const useDataRefresh = () => {
  const store = useStopSearchStore()

  /**
   * Check and refresh latest available date in background
   * This ensures the site always knows about the latest data without blocking the UI
   */
  const refreshLatestDate = async () => {
    if (process.server) return
    
    try {
      // Check if we need to refresh (data older than 12 hours)
      const storedTimestamp = localStorage.getItem('availableDatasetsTimestamp')
      if (storedTimestamp) {
        const age = Date.now() - parseInt(storedTimestamp)
        const staleThreshold = 12 * 60 * 60 * 1000 // 12 hours
        
        if (age < staleThreshold) {
          // Data is fresh, no need to refresh
          return
        }
      }
      
      // Refresh in background
      await store.fetchAvailableDatasets(true)
      console.log('✅ Latest data date refreshed in background')
    } catch (error) {
      console.warn('⚠️ Background date refresh failed:', error)
      // Non-critical error, don't throw
    }
  }

  /**
   * Initialize background refresh on page load
   * Runs after a short delay to not interfere with initial page load
   */
  const initializeBackgroundRefresh = () => {
    if (process.server) return
    
    let interval: ReturnType<typeof setInterval> | null = null
    
    // Wait 3 seconds after page load before starting background refresh
    setTimeout(() => {
      refreshLatestDate()
    }, 3000)
    
    // Also refresh every hour while page is active
    interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshLatestDate()
      }
    }, 60 * 60 * 1000) // Every hour
    
    // Cleanup on unmount
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }

  return {
    refreshLatestDate,
    initializeBackgroundRefresh
  }
}
