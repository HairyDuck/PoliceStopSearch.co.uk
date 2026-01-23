export default defineEventHandler(async (event) => {
  const baseUrl = 'https://policestopsearch.co.uk'
  const currentDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  
  // Try to fetch forces dynamically from API, with fallback to static list
  let forces: string[] = []
  try {
    const response = await fetch('https://data.police.uk/api/forces')
    if (response.ok) {
      const forcesData = await response.json()
      forces = forcesData.map((force: { id: string }) => force.id)
    } else {
      throw new Error('API request failed')
    }
  } catch (error) {
    // Fallback to static list if API fails
    console.warn('Failed to fetch forces from API, using static list:', error)
    forces = [
      'avon-and-somerset', 'bedfordshire', 'cambridgeshire', 'cheshire', 'city-of-london',
      'cleveland', 'cumbria', 'derbyshire', 'devon-and-cornwall', 'dorset', 'durham',
      'dyfed-powys', 'essex', 'gloucestershire', 'greater-manchester', 'gwent', 'hampshire',
      'hertfordshire', 'humberside', 'kent', 'lancashire', 'leicestershire', 'lincolnshire',
      'merseyside', 'metropolitan', 'norfolk', 'north-wales', 'north-yorkshire', 'northamptonshire',
      'northumbria', 'northern-ireland', 'nottinghamshire', 'police-scotland', 'psni',
      'south-wales', 'south-yorkshire', 'staffordshire', 'suffolk', 'surrey', 'sussex',
      'thames-valley', 'warwickshire', 'west-mercia', 'west-midlands', 'west-yorkshire', 'wiltshire'
    ]
  }
  
  // Define static pages with lastmod dates
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
    { url: '/map', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/analytics', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/statistics', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/forces', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    { url: '/about', priority: '0.5', changefreq: 'monthly', lastmod: '2025-01-23' },
    { url: '/know-your-rights', priority: '0.6', changefreq: 'monthly', lastmod: '2025-01-23' },
    { url: '/api', priority: '0.4', changefreq: 'monthly', lastmod: '2025-01-23' },
    { url: '/faq', priority: '0.4', changefreq: 'monthly', lastmod: '2025-01-23' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly', lastmod: '2025-01-23' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly', lastmod: '2025-01-23' }
  ]
  
  // Generate XML sitemap with image namespace
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
  
  // Add static pages with images
  staticPages.forEach(page => {
    sitemap += `  <url>\n`
    sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`
    sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`
    sitemap += `    <priority>${page.priority}</priority>\n`
    // Add image for homepage
    if (page.url === '/') {
      sitemap += `    <image:image>\n`
      sitemap += `      <image:loc>${baseUrl}/images/puk-logo.png</image:loc>\n`
      sitemap += `      <image:title>UK Police Stop and Search Data Portal</image:title>\n`
      sitemap += `    </image:image>\n`
    }
    sitemap += `  </url>\n`
  })
  
  // Add force-specific statistics pages
  forces.forEach(force => {
    sitemap += `  <url>\n`
    sitemap += `    <loc>${baseUrl}/statistics?force=${force}</loc>\n`
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`
    sitemap += `    <changefreq>daily</changefreq>\n`
    sitemap += `    <priority>0.8</priority>\n`
    sitemap += `  </url>\n`
  })
  
  // Add force-specific analytics pages
  forces.forEach(force => {
    sitemap += `  <url>\n`
    sitemap += `    <loc>${baseUrl}/analytics?force=${force}</loc>\n`
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`
    sitemap += `    <changefreq>weekly</changefreq>\n`
    sitemap += `    <priority>0.7</priority>\n`
    sitemap += `  </url>\n`
  })
  
  sitemap += '</urlset>'
  
  // Set response headers
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600') // Cache for 1 hour
  
  return sitemap
})
