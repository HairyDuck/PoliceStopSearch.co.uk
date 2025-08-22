import { defineEventHandler } from 'h3'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Cache file path
const CACHE_FILE = path.join(process.cwd(), 'data', 'server-cache.json')

export default defineEventHandler(async () => {
  try {
    if (!existsSync(CACHE_FILE)) {
      return { forcesWithIssues: [] }
    }

    const cacheData = await readFile(CACHE_FILE, 'utf-8')
    const cache = JSON.parse(cacheData)

    // Analyze cache entries to find forces with no data
    const forceData: Record<string, { totalIncidents: number, monthsWithData: number, totalMonths: number }> = {}
    const forcesWithIssues: string[] = []

    // Process all cache entries
    Object.keys(cache).forEach(key => {
      if (key.startsWith('aggregated:')) {
        const parts = key.split(':')
        if (parts.length >= 3) {
          const forceId = parts[1]
          const month = parts[2]
          const data = cache[key]?.data

          if (!forceData[forceId]) {
            forceData[forceId] = { totalIncidents: 0, monthsWithData: 0, totalMonths: 0 }
          }

          forceData[forceId].totalMonths++
          
          if (data && data.total > 0) {
            forceData[forceId].totalIncidents += data.total
            forceData[forceId].monthsWithData++
          }
        }
      }
    })

    // Identify forces with transparency issues
    Object.entries(forceData).forEach(([forceId, stats]) => {
      // Consider a force to have transparency issues if:
      // 1. It has no incidents at all, OR
      // 2. It has data for less than 10% of available months
      if (stats.totalIncidents === 0 || (stats.monthsWithData / stats.totalMonths) < 0.1) {
        forcesWithIssues.push(forceId)
      }
    })

    return { 
      forcesWithIssues,
      analysis: forceData
    }
  } catch (error) {
    console.error('Error analyzing transparency:', error)
    return { forcesWithIssues: [] }
  }
})
