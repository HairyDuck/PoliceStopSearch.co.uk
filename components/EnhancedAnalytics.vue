<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-xl font-semibold mb-4">Enhanced Analytics</h3>
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="bg-blue-50 p-3 md:p-4 rounded-lg">
        <div class="text-xs md:text-sm text-blue-600 font-medium">Total Incidents</div>
        <div class="text-lg md:text-2xl font-bold text-blue-900">{{ totalIncidents }}</div>
        <div class="text-xs md:text-sm text-blue-700">{{ selectedForces.length }} forces</div>
      </div>
      
      <div class="bg-green-50 p-3 md:p-4 rounded-lg">
        <div class="text-xs md:text-sm text-green-600 font-medium">Arrest Rate</div>
        <div class="text-lg md:text-2xl font-bold text-green-900">{{ arrestRate }}%</div>
        <div class="text-xs md:text-sm text-green-700">{{ totalArrests }} arrests</div>
      </div>
      
      <div class="bg-purple-50 p-3 md:p-4 rounded-lg">
        <div class="text-xs md:text-sm text-purple-600 font-medium">Peak Hour</div>
        <div class="text-lg md:text-2xl font-bold text-purple-900">{{ peakHour }}</div>
        <div class="text-xs md:text-sm text-purple-700">{{ peakHourCount }} incidents</div>
      </div>
      
      <div class="bg-orange-50 p-3 md:p-4 rounded-lg">
        <div class="text-xs md:text-sm text-orange-600 font-medium">Busiest Day</div>
        <div class="text-lg md:text-2xl font-bold text-orange-900">{{ busiestDay }}</div>
        <div class="text-xs md:text-sm text-orange-700">{{ busiestDayCount }} incidents</div>
      </div>
    </div>

         <!-- Demographic Analysis -->
     <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Ethnicity Breakdown -->
       <div class="bg-gray-50 p-3 md:p-4 rounded-lg">
         <h4 class="text-base md:text-lg font-medium mb-3">Ethnicity Breakdown</h4>
         <div class="space-y-2">
           <div
             v-for="(count, ethnicity) in ethnicityBreakdown"
             :key="ethnicity"
             class="flex items-center"
           >
             <span class="text-xs md:text-sm text-gray-700 truncate w-24 sm:w-32 md:w-48 mr-2 md:mr-3" :title="ethnicity">{{ ethnicity }}</span>
             <div class="flex items-center flex-1 min-w-0">
               <div class="w-16 sm:w-24 md:w-32 bg-gray-200 rounded-full h-2 mr-2 md:mr-3 flex-shrink-0">
                 <div 
                   class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                   :style="{ width: (count / totalIncidents * 100) + '%' }"
                 ></div>
               </div>
               <span class="text-xs md:text-sm font-medium text-gray-900 w-12 md:w-16 text-right flex-shrink-0">{{ count.toLocaleString() }}</span>
             </div>
           </div>
         </div>
       </div>

       <!-- Age Range Breakdown -->
       <div class="bg-gray-50 p-3 md:p-4 rounded-lg">
         <h4 class="text-base md:text-lg font-medium mb-3">Age Range Breakdown</h4>
         <div class="space-y-2">
           <div
             v-for="(count, ageRange) in ageRangeBreakdown"
             :key="ageRange"
             class="flex items-center"
           >
             <span class="text-xs md:text-sm text-gray-700 truncate w-24 sm:w-32 md:w-48 mr-2 md:mr-3" :title="ageRange">{{ ageRange }}</span>
             <div class="flex items-center flex-1 min-w-0">
               <div class="w-16 sm:w-24 md:w-32 bg-gray-200 rounded-full h-2 mr-2 md:mr-3 flex-shrink-0">
                 <div 
                   class="bg-green-600 h-2 rounded-full transition-all duration-300" 
                   :style="{ width: (count / totalIncidents * 100) + '%' }"
                 ></div>
               </div>
               <span class="text-xs md:text-sm font-medium text-gray-900 w-12 md:w-16 text-right flex-shrink-0">{{ count.toLocaleString() }}</span>
             </div>
           </div>
         </div>
       </div>
     </div>

     <!-- Legal Analysis -->
     <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
       <!-- Legislation Breakdown -->
       <div class="bg-gray-50 p-3 md:p-4 rounded-lg">
         <h4 class="text-base md:text-lg font-medium mb-3">Legislation Used</h4>
         <div class="space-y-2">
           <div
             v-for="(count, legislation) in legislationBreakdown"
             :key="legislation"
             class="flex items-center"
           >
             <span class="text-xs md:text-sm text-gray-700 truncate w-24 sm:w-32 md:w-48 mr-2 md:mr-3" :title="legislation">{{ legislation }}</span>
             <div class="flex items-center flex-1 min-w-0">
               <div class="w-16 sm:w-24 md:w-32 bg-gray-200 rounded-full h-2 mr-2 md:mr-3 flex-shrink-0">
                 <div 
                   class="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                   :style="{ width: (count / totalIncidents * 100) + '%' }"
                 ></div>
               </div>
               <span class="text-xs md:text-sm font-medium text-gray-900 w-12 md:w-16 text-right flex-shrink-0">{{ count.toLocaleString() }}</span>
             </div>
           </div>
         </div>
       </div>

       <!-- Object of Search -->
       <div class="bg-gray-50 p-3 md:p-4 rounded-lg">
         <h4 class="text-base md:text-lg font-medium mb-3">Objects of Search</h4>
         <div class="space-y-2">
           <div
             v-for="(count, object) in objectOfSearchBreakdown"
             :key="object"
             class="flex items-center"
           >
             <span class="text-xs md:text-sm text-gray-700 truncate w-24 sm:w-32 md:w-48 mr-2 md:mr-3" :title="object">{{ object }}</span>
             <div class="flex items-center flex-1 min-w-0">
               <div class="w-16 sm:w-24 md:w-32 bg-gray-200 rounded-full h-2 mr-2 md:mr-3 flex-shrink-0">
                 <div 
                   class="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                   :style="{ width: (count / totalIncidents * 100) + '%' }"
                 ></div>
               </div>
               <span class="text-xs md:text-sm font-medium text-gray-900 w-12 md:w-16 text-right flex-shrink-0">{{ count.toLocaleString() }}</span>
             </div>
           </div>
         </div>
       </div>
     </div>

    <!-- Time Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
      <!-- Hourly Pattern -->
      <div class="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-1 sm:space-y-0">
          <h4 class="text-base md:text-lg font-medium">Hourly Pattern</h4>
          <div class="text-xs md:text-sm text-gray-500">
            Peak: {{ peakHour }} ({{ peakHourCount }} incidents)
          </div>
        </div>
        <div class="h-48 md:h-64">
          <canvas ref="hourlyChart" height="250"></canvas>
        </div>
        <div class="mt-3 text-xs text-gray-500 text-center">
          Shows the distribution of incidents across 24 hours
        </div>
      </div>

      <!-- Day of Week Pattern -->
      <div class="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-1 sm:space-y-0">
          <h4 class="text-base md:text-lg font-medium">Day of Week Pattern</h4>
          <div class="text-xs md:text-sm text-gray-500">
            Busiest: {{ busiestDay }} ({{ busiestDayCount }} incidents)
          </div>
        </div>
        <div class="h-48 md:h-64">
          <canvas ref="dayOfWeekChart" height="250"></canvas>
        </div>
        <div class="mt-3 text-xs text-gray-500 text-center">
          Shows the distribution of incidents across days of the week
        </div>
      </div>
    </div>

    <!-- Location Summary -->
    <div class="bg-gray-50 p-3 md:p-4 rounded-lg">
      <h4 class="text-base md:text-lg font-medium mb-3">Location Summary</h4>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
        <div class="text-center">
          <div class="text-xl md:text-2xl font-bold text-blue-900">{{ uniqueLocations }}</div>
          <div class="text-xs md:text-sm text-gray-600">Total Locations</div>
        </div>
        <div class="text-center">
          <div class="text-xl md:text-2xl font-bold text-green-900">{{ clusteredLocations.length }}</div>
          <div class="text-xs md:text-sm text-gray-600">Displayed Points</div>
        </div>
        <div class="text-center">
          <div class="text-xl md:text-2xl font-bold text-purple-900">{{ averageLocationCount }}</div>
          <div class="text-xs md:text-sm text-gray-600">Avg Incidents per Point</div>
        </div>
        <div class="text-center">
          <div class="text-xl md:text-2xl font-bold text-orange-900">{{ maxLocationCount }}</div>
          <div class="text-xs md:text-sm text-gray-600">Max Incidents at Point</div>
        </div>
      </div>
      <div v-if="uniqueLocations > clusteredLocations.length" class="mt-3 text-center">
        <div class="text-xs text-gray-500">
          <span class="font-medium">Smart Clustering:</span> 
          {{ uniqueLocations - clusteredLocations.length }} nearby locations have been grouped together for better visualization
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  data: any[]
  selectedForces: string[]
}>()

// Chart refs
const hourlyChart = ref<HTMLCanvasElement>()
const dayOfWeekChart = ref<HTMLCanvasElement>()

// Chart instances
let hourlyChartInstance: Chart | null = null
let dayOfWeekChartInstance: Chart | null = null

// Computed properties for enhanced analytics
const totalIncidents = computed(() => {
  return props.data.reduce((sum, item) => sum + (item.incidents || 0), 0)
})

const totalArrests = computed(() => {
  return props.data.reduce((sum, item) => sum + (item.arrests || 0), 0)
})

const arrestRate = computed(() => {
  return totalIncidents.value > 0 ? Math.round((totalArrests.value / totalIncidents.value) * 100) : 0
})

// Aggregate all the breakdown data
const ethnicityBreakdown = computed(() => {
  const breakdown: Record<string, number> = {}
  
  // Limit processing to prevent stack overflow with large datasets
  const dataToProcess = props.data.slice(0, 1000) // Limit to first 1000 items
  
  dataToProcess.forEach(item => {
    if (item.by_ethnicity) {
      Object.entries(item.by_ethnicity).forEach(([ethnicity, count]) => {
        breakdown[ethnicity] = (breakdown[ethnicity] || 0) + (count as number)
      })
    }
  })
  
  // Sort by count in descending order
  const sortedEntries = Object.entries(breakdown).sort(([,a], [,b]) => b - a)
  const sortedBreakdown: Record<string, number> = {}
  
  sortedEntries.forEach(([ethnicity, count]) => {
    sortedBreakdown[ethnicity] = count
  })
  
  return sortedBreakdown
})

const ageRangeBreakdown = computed(() => {
  const breakdown: Record<string, number> = {}
  
  // Limit processing to prevent stack overflow with large datasets
  const dataToProcess = props.data.slice(0, 1000) // Limit to first 1000 items
  
  dataToProcess.forEach(item => {
    if (item.by_age_range) {
      Object.entries(item.by_age_range).forEach(([ageRange, count]) => {
        breakdown[ageRange] = (breakdown[ageRange] || 0) + (count as number)
      })
    }
  })
  
  // Sort age ranges in chronological order
  const ageOrder = ['under 10', '10-17', '18-24', '25-34', 'over 34', 'Unknown']
  const sortedBreakdown: Record<string, number> = {}
  
  ageOrder.forEach(ageRange => {
    if (breakdown[ageRange] !== undefined) {
      sortedBreakdown[ageRange] = breakdown[ageRange]
    }
  })
  
  return sortedBreakdown
})

const legislationBreakdown = computed(() => {
  const breakdown: Record<string, number> = {}
  
  // Limit processing to prevent stack overflow with large datasets
  const dataToProcess = props.data.slice(0, 1000) // Limit to first 1000 items
  
  dataToProcess.forEach(item => {
    if (item.by_legislation) {
      Object.entries(item.by_legislation).forEach(([legislation, count]) => {
        breakdown[legislation] = (breakdown[legislation] || 0) + (count as number)
      })
    }
  })
  return breakdown
})

const objectOfSearchBreakdown = computed(() => {
  const breakdown: Record<string, number> = {}
  
  // Limit processing to prevent stack overflow with large datasets
  const dataToProcess = props.data.slice(0, 1000) // Limit to first 1000 items
  
  dataToProcess.forEach(item => {
    if (item.by_object_of_search) {
      Object.entries(item.by_object_of_search).forEach(([object, count]) => {
        breakdown[object] = (breakdown[object] || 0) + (count as number)
      })
    }
  })
  return breakdown
})

const hourlyBreakdown = computed(() => {
  const breakdown: Record<string, number> = {}
  
  // Limit processing to prevent stack overflow with large datasets
  const dataToProcess = props.data.slice(0, 1000) // Limit to first 1000 items
  
  dataToProcess.forEach(item => {
    if (item.by_hour) {
      Object.entries(item.by_hour).forEach(([hour, count]) => {
        breakdown[hour] = (breakdown[hour] || 0) + (count as number)
      })
    }
  })
  return breakdown
})

const dayOfWeekBreakdown = computed(() => {
  const breakdown: Record<string, number> = {}
  
  // Limit processing to prevent stack overflow with large datasets
  const dataToProcess = props.data.slice(0, 1000) // Limit to first 1000 items
  
  dataToProcess.forEach(item => {
    if (item.by_day_of_week) {
      Object.entries(item.by_day_of_week).forEach(([day, count]) => {
        breakdown[day] = (breakdown[day] || 0) + (count as number)
      })
    }
  })
  return breakdown
})

// Peak analysis
const peakHour = computed(() => {
  const hourly = hourlyBreakdown.value
  const peakHour = Object.entries(hourly).reduce((max, [hour, count]) => 
    count > max.count ? { hour, count } : max, { hour: '0', count: 0 }
  )
  return peakHour.hour + ':00'
})

const peakHourCount = computed(() => {
  const hourly = hourlyBreakdown.value
  const peakHour = Object.entries(hourly).reduce((max, [hour, count]) => 
    count > max.count ? { hour, count } : max, { hour: '0', count: 0 }
  )
  return peakHour.count
})

const busiestDay = computed(() => {
  const daily = dayOfWeekBreakdown.value
  const busiestDay = Object.entries(daily).reduce((max, [day, count]) => 
    count > max.count ? { day, count } : max, { day: 'Unknown', count: 0 }
  )
  return busiestDay.day
})

const busiestDayCount = computed(() => {
  const daily = dayOfWeekBreakdown.value
  const busiestDay = Object.entries(daily).reduce((max, [day, count]) => 
    count > max.count ? { day, count } : max, { day: 'Unknown', count: 0 }
  )
  return busiestDay.count
})

// Location clustering function
const clusterLocations = (locations: any[], maxClusters: number = 100) => {
  if (locations.length <= maxClusters) return locations

  // Sort locations by count (highest first) to prioritize important locations
  const sortedLocations = [...locations].sort((a, b) => (b.count || 1) - (a.count || 1))
  
  // Keep the top locations (most incidents)
  const topLocations = sortedLocations.slice(0, Math.floor(maxClusters * 0.7))
  
  // Cluster the remaining locations by proximity
  const remainingLocations = sortedLocations.slice(Math.floor(maxClusters * 0.7))
  const clusters: any[] = []
  
  remainingLocations.forEach(location => {
    const lat = location.lat || location.latitude
    const lng = location.lng || location.longitude
    
    if (!lat || !lng) return
    
    // Find the closest existing cluster
    let closestCluster = null
    let minDistance = Infinity
    
    clusters.forEach(cluster => {
      const distance = Math.sqrt(
        Math.pow(lat - cluster.lat, 2) + Math.pow(lng - cluster.lng, 2)
      )
      if (distance < minDistance && distance < 0.1) { // 0.1 degrees ≈ 11km
        minDistance = distance
        closestCluster = cluster
      }
    })
    
    if (closestCluster) {
      // Add to existing cluster
      closestCluster.count += location.count || 1
      closestCluster.locations.push(location)
    } else {
      // Create new cluster
      clusters.push({
        lat,
        lng,
        count: location.count || 1,
        locations: [location],
        name: location.name || 'Clustered Location'
      })
    }
  })
  
  // Combine top locations with clusters
  return [...topLocations, ...clusters]
}

// Location analysis
const uniqueLocations = computed(() => {
  const allLocations = props.data.flatMap(item => item.locations || [])
  return allLocations.length
})

const clusteredLocations = computed(() => {
  const allLocations = props.data.flatMap(item => item.locations || [])
  if (allLocations.length === 0) return []
  
  // Determine max clusters based on data size
  let maxClusters = 100
  if (allLocations.length > 1000) maxClusters = 50
  if (allLocations.length > 5000) maxClusters = 25
  
  return clusterLocations(allLocations, maxClusters)
})

const averageLocationCount = computed(() => {
  const locations = clusteredLocations.value
  if (locations.length === 0) return 0
  const totalCount = locations.reduce((sum, loc) => sum + (loc.count || 1), 0)
  return Math.round(totalCount / locations.length)
})

const maxLocationCount = computed(() => {
  const locations = clusteredLocations.value
  if (locations.length === 0) return 0
  return locations.reduce((max, loc) => Math.max(max, loc.count || 1), 0)
})

// Chart creation functions
const createHourlyChart = () => {
  if (!hourlyChart.value) return

  const ctx = hourlyChart.value.getContext('2d')
  if (!ctx) return

  // Prepare data for 24 hours
  const labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
  const data = labels.map((_, index) => hourlyBreakdown.value[index.toString()] || 0)

  hourlyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Incidents',
        data: data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#3B82F6',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (context) => `Time: ${context[0].label}`,
            label: (context) => `${context.parsed.y} incidents`
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 12,
            color: '#6B7280',
            font: {
              size: 10
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 10
            },
            callback: (value) => {
              if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'k'
              }
              return value
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  })
}

const createDayOfWeekChart = () => {
  if (!dayOfWeekChart.value) return

  const ctx = dayOfWeekChart.value.getContext('2d')
  if (!ctx) return

  // Order days properly
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const labels = dayOrder.filter(day => dayOfWeekBreakdown.value[day] !== undefined)
  const data = labels.map(day => dayOfWeekBreakdown.value[day] || 0)

  dayOfWeekChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Incidents',
        data: data,
        backgroundColor: labels.map((_, index) => {
          // Create a gradient effect - weekend days in different color
          const day = dayOrder.find(d => d === labels[index])
          return day === 'Saturday' || day === 'Sunday' ? '#EF4444' : '#3B82F6'
        }),
        borderColor: labels.map((_, index) => {
          const day = dayOrder.find(d => d === labels[index])
          return day === 'Saturday' || day === 'Sunday' ? '#DC2626' : '#2563EB'
        }),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: labels.map((_, index) => {
          const day = dayOrder.find(d => d === labels[index])
          return day === 'Saturday' || day === 'Sunday' ? '#F87171' : '#60A5FA'
        })
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#3B82F6',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (context) => `${context[0].label}`,
            label: (context) => `${context.parsed.y} incidents`
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 11
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 10
            },
            callback: (value) => {
              if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'k'
              }
              return value
            }
          }
        }
      }
    }
  })
}

const updateCharts = () => {
  // Destroy existing charts
  if (hourlyChartInstance) {
    hourlyChartInstance.destroy()
    hourlyChartInstance = null
  }
  if (dayOfWeekChartInstance) {
    dayOfWeekChartInstance.destroy()
    dayOfWeekChartInstance = null
  }

  // Create new charts
  createHourlyChart()
  createDayOfWeekChart()
}

// Lifecycle hooks
onMounted(() => {
  updateCharts()
})

onUnmounted(() => {
  if (hourlyChartInstance) {
    hourlyChartInstance.destroy()
  }
  if (dayOfWeekChartInstance) {
    dayOfWeekChartInstance.destroy()
  }
})

// Watch for data changes
watch(() => props.data, () => {
  updateCharts()
}, { deep: true })
</script>
