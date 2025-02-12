export const useAnalytics = () => {
  const trackSearch = (searchType: string, query: string) => {
    window.gtag('event', 'search', {
      search_type: searchType,
      search_term: query
    })
  }

  const trackForceView = (forceName: string) => {
    window.gtag('event', 'force_view', {
      force_name: forceName
    })
  }

  const trackMapInteraction = (action: string, details?: Record<string, any>) => {
    window.gtag('event', 'map_interaction', {
      action,
      ...details
    })
  }

  const trackDataDownload = (dataType: string, forceId?: string, period?: string) => {
    window.gtag('event', 'data_download', {
      data_type: dataType,
      force_id: forceId,
      time_period: period
    })
  }

  const trackFilterUse = (filterType: string, value: string) => {
    window.gtag('event', 'filter_use', {
      filter_type: filterType,
      filter_value: value
    })
  }

  const trackChartInteraction = (chartType: string, action: string) => {
    window.gtag('event', 'chart_interaction', {
      chart_type: chartType,
      action: action
    })
  }

  const trackError = (errorType: string, errorMessage: string, errorContext?: string) => {
    window.gtag('event', 'error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      error_context: errorContext
    })
  }

  const trackFeatureUse = (featureName: string, action: string) => {
    window.gtag('event', 'feature_use', {
      feature_name: featureName,
      action: action
    })
  }

  const trackPerformanceMetric = (metricName: string, value: number) => {
    window.gtag('event', 'performance_metric', {
      metric_name: metricName,
      value: value
    })
  }

  return {
    trackSearch,
    trackForceView,
    trackMapInteraction,
    trackDataDownload,
    trackFilterUse,
    trackChartInteraction,
    trackError,
    trackFeatureUse,
    trackPerformanceMetric
  }
} 