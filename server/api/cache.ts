import { defineEventHandler, getQuery, setResponseHeader, createError, readBody } from 'h3'
import { writeFile, readFile, access, mkdir } from 'fs/promises'
import { join } from 'path'

// Persistent cache file path
const CACHE_FILE_PATH = join(process.cwd(), 'data', 'server-cache.json')

// Server-side cache storage with persistence
let serverCache = new Map<string, { data: any, timestamp: number, ttl: number }>()

// Cache configuration
const CACHE_TTL = 90 * 24 * 60 * 60 * 1000 // 90 days
const MAX_CACHE_SIZE = 2000 // Maximum number of cache entries (44 forces × 24 months = 1056 + buffer)
const CLEANUP_INTERVAL = 60 * 60 * 1000 // 1 hour

// File write lock to prevent concurrent writes
let isWriting = false
let writeQueue: (() => Promise<void>)[] = []

// Load cache from file on startup
async function loadCacheFromFile() {
  try {
    await access(CACHE_FILE_PATH)
    const cacheData = await readFile(CACHE_FILE_PATH, 'utf-8')
    const parsedCache = JSON.parse(cacheData)
    
    // Convert back to Map and filter out expired entries
    const now = Date.now()
    serverCache = new Map()
    
    for (const [key, entry] of Object.entries(parsedCache)) {
      const cacheEntry = entry as { data: any, timestamp: number, ttl: number }
      if (now - cacheEntry.timestamp <= cacheEntry.ttl) {
        serverCache.set(key, cacheEntry)
      }
    }
    
    console.log(`📦 Loaded ${serverCache.size} cache entries from file`)
  } catch (error) {
    // File doesn't exist or is invalid, start with empty cache
    serverCache = new Map()
    console.log('📦 Starting with empty cache')
  }
}

// Save cache to file with queue management
async function saveCacheToFile() {
  return new Promise<void>((resolve, reject) => {
    const saveOperation = async () => {
      try {
        // Ensure data directory exists
        await mkdir(join(process.cwd(), 'data'), { recursive: true })
        
        // Convert Map to object for JSON serialization
        const cacheObject = Object.fromEntries(serverCache)
        await writeFile(CACHE_FILE_PATH, JSON.stringify(cacheObject, null, 2))
        resolve()
      } catch (error) {
        console.error('❌ Failed to save cache to file:', error)
        reject(error)
      } finally {
        isWriting = false
        // Process next item in queue
        if (writeQueue.length > 0) {
          const nextOperation = writeQueue.shift()!
          isWriting = true
          nextOperation()
        }
      }
    }

    if (isWriting) {
      // Queue the operation
      writeQueue.push(saveOperation)
    } else {
      isWriting = true
      saveOperation()
    }
  })
}

// Cleanup function to remove expired entries
async function cleanupExpiredCache() {
  const now = Date.now()
  let cleanedCount = 0
  
  for (const [key, entry] of serverCache.entries()) {
    if (now - entry.timestamp > entry.ttl) {
      serverCache.delete(key)
      cleanedCount++
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🗑️ Server cache cleanup: removed ${cleanedCount} expired entries`)
    await saveCacheToFile() // Save after cleanup
  }
}

// Load cache on startup
loadCacheFromFile()

// Periodic cleanup
setInterval(cleanupExpiredCache, CLEANUP_INTERVAL)

export default defineEventHandler(async (event) => {
  let query, body
  
  // Handle both GET and POST requests
  if (event.method === 'POST') {
    body = await readBody(event)
    query = body
  } else {
    query = getQuery(event)
  }
  
  const { action, key, data, ttl } = query
  
  // Check if we're in build mode (prerendering) or if external APIs are unavailable
  const isBuildMode = process.env.NODE_ENV === 'production' && process.env.NITRO_PRESET === 'static'
  const isPrerendering = process.env.NITRO_PRESET === 'static'
  
  if (isBuildMode || isPrerendering) {
    // Return fallback data for build time
    const fallbackData = {
      size: 0,
      maxSize: MAX_CACHE_SIZE,
      keys: [],
      oldestEntry: null,
      newestEntry: null,
      success: true,
      cacheSize: 0,
      clearedEntries: 0,
      setCount: 0,
      fallback: true
    }
    
    // Return appropriate response based on action
    switch (action) {
      case 'stats':
        return fallbackData
      case 'get':
        return { cached: false, data: null, fallback: true }
      case 'getMultiple':
        return {
          cached: {},
          cachedCount: 0,
          missingKeys: [],
          totalRequested: 0,
          fallback: true
        }
      case 'getForceData':
        const forceIdParam = query.forceId || (body && body.forceId)
        const monthsParam = query.months || (body && body.months)
        let months = []
        try {
          months = monthsParam ? JSON.parse(monthsParam as string) : []
        } catch (error) {
          months = []
        }
        return {
          forceId: forceIdParam || '',
          cached: {},
          cachedCount: 0,
          missingMonths: months,
          totalMonths: months.length,
          fallback: true
        }
      default:
        return fallbackData
    }
  }
  
  // Set CORS headers
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')
  setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  
  try {
    switch (action) {
      case 'get':
        if (!key) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Key is required for get action'
          })
        }
        
        const entry = serverCache.get(key as string)
        if (!entry) {
          return { cached: false, data: null }
        }
        
        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
          serverCache.delete(key as string)
          await saveCacheToFile() // Save after deletion
          return { cached: false, data: null }
        }
        
        return { cached: true, data: entry.data }
        
      case 'set':
        if (!key || !data) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Key and data are required for set action'
          })
        }
        
        // Enforce cache size limit
        if (serverCache.size >= MAX_CACHE_SIZE) {
          // Remove oldest entries
          const entries = Array.from(serverCache.entries())
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
          const toRemove = entries.slice(0, Math.floor(MAX_CACHE_SIZE * 0.1)) // Remove 10% oldest
          toRemove.forEach(([key]) => serverCache.delete(key))
          console.log(`🗑️ Server cache size limit reached, removed ${toRemove.length} oldest entries`)
        }
        
        let parsedData
        try {
          parsedData = JSON.parse(data as string)
        } catch (error) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid JSON data'
          })
        }
        
        serverCache.set(key as string, {
          data: parsedData,
          timestamp: Date.now(),
          ttl: parseInt(ttl as string) || CACHE_TTL
        })
        
        // Save to file after setting
        await saveCacheToFile()
        
        return { success: true, cacheSize: serverCache.size }
        
      case 'delete':
        if (!key) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Key is required for delete action'
          })
        }
        
        const deleted = serverCache.delete(key as string)
        if (deleted) {
          await saveCacheToFile() // Save after deletion
        }
        return { success: deleted, cacheSize: serverCache.size }
        
      case 'clear':
        const size = serverCache.size
        serverCache.clear()
        await saveCacheToFile() // Save after clearing
        return { success: true, clearedEntries: size }
        
      case 'stats':
        const stats = {
          size: serverCache.size,
          maxSize: MAX_CACHE_SIZE,
          keys: Array.from(serverCache.keys()),
          oldestEntry: null as any,
          newestEntry: null as any
        }
        
        if (serverCache.size > 0) {
          const entries = Array.from(serverCache.entries())
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
          stats.oldestEntry = { key: entries[0][0], timestamp: entries[0][1].timestamp }
          stats.newestEntry = { key: entries[entries.length - 1][0], timestamp: entries[entries.length - 1][1].timestamp }
        }
        
        return stats
        
      case 'getMultiple':
        const keysParam = query.keys || (body && body.keys)
        if (!keysParam) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Keys array is required for getMultiple action'
          })
        }
        
        let keys
        try {
          keys = JSON.parse(keysParam as string)
        } catch (error) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid JSON keys array'
          })
        }
        
        if (!Array.isArray(keys)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Keys must be an array'
          })
        }
        
        const results: { [key: string]: any } = {}
        let cachedCount = 0
        let missingKeys: string[] = []
        
        for (const key of keys) {
          const entry = serverCache.get(key)
          if (entry && Date.now() - entry.timestamp <= entry.ttl) {
            results[key] = entry.data
            cachedCount++
          } else {
            if (entry) {
              // Remove expired entry
              serverCache.delete(key)
            }
            missingKeys.push(key)
          }
        }
        
        // Save if we removed expired entries
        if (missingKeys.length > 0) {
          await saveCacheToFile()
        }
        
        return {
          cached: results,
          cachedCount,
          missingKeys,
          totalRequested: keys.length
        }
        
      case 'setMultiple':
        const dataParam = query.data || (body && body.data)
        if (!dataParam) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Data object is required for setMultiple action'
          })
        }
        
        let dataToCache
        try {
          dataToCache = JSON.parse(dataParam as string)
        } catch (error) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid JSON data object'
          })
        }
        
        if (typeof dataToCache !== 'object' || dataToCache === null) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Data must be an object'
          })
        }
        
        let setCount = 0
        
        // Enforce cache size limit before adding new entries
        if (serverCache.size + Object.keys(dataToCache).length >= MAX_CACHE_SIZE) {
          const entries = Array.from(serverCache.entries())
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
          const toRemove = entries.slice(0, Math.floor(MAX_CACHE_SIZE * 0.2)) // Remove 20% oldest
          toRemove.forEach(([key]) => serverCache.delete(key))
          console.log(`🗑️ Server cache size limit reached, removed ${toRemove.length} oldest entries`)
        }
        
        for (const [key, data] of Object.entries(dataToCache)) {
          serverCache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: parseInt(ttl as string) || CACHE_TTL
          })
          setCount++
        }
        
        // Save to file after setting multiple entries
        await saveCacheToFile()
        
        return { success: true, setCount, cacheSize: serverCache.size }
        
      case 'getForceData':
        const forceIdParam = query.forceId || (body && body.forceId)
        const monthsParam = query.months || (body && body.months)
        if (!forceIdParam || !monthsParam) {
          throw createError({
            statusCode: 400,
            statusMessage: 'forceId and months are required for getForceData action'
          })
        }
        
        let months
        try {
          months = JSON.parse(monthsParam as string)
        } catch (error) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid JSON months array'
          })
        }
        
        if (!Array.isArray(months)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Months must be an array'
          })
        }
        
        const forceId = forceIdParam as string
        const forceResults: { [key: string]: any } = {}
        let forceCachedCount = 0
        let forceMissingMonths: string[] = []
        
        for (const month of months) {
          const key = `aggregated:${forceId}:${month}`
          const entry = serverCache.get(key)
          if (entry && Date.now() - entry.timestamp <= entry.ttl) {
            forceResults[month] = entry.data
            forceCachedCount++
          } else {
            if (entry) {
              serverCache.delete(key)
            }
            forceMissingMonths.push(month)
          }
        }
        
        // Save if we removed expired entries
        if (forceMissingMonths.length > 0) {
          await saveCacheToFile()
        }
        
        return {
          forceId,
          cached: forceResults,
          cachedCount: forceCachedCount,
          missingMonths: forceMissingMonths,
          totalMonths: months.length
        }
        
      default:
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid action. Use: get, set, delete, clear, stats, getMultiple, setMultiple, or getForceData'
        })
    }
  } catch (error) {
    console.error('Cache API error:', error)
    throw error
  }
})
