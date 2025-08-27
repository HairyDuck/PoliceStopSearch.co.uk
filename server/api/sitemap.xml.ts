export default defineEventHandler(async (event) => {
  const baseUrl = 'https://policestopsearch.co.uk'
  
  // Define all police forces
  const forces = [
    'avon-and-somerset', 'bedfordshire', 'cambridgeshire', 'cheshire', 'city-of-london',
    'cleveland', 'cumbria', 'derbyshire', 'devon-and-cornwall', 'dorset', 'durham',
    'dyfed-powys', 'essex', 'gloucestershire', 'greater-manchester', 'gwent', 'hampshire',
    'hertfordshire', 'humberside', 'kent', 'lancashire', 'leicestershire', 'lincolnshire',
    'merseyside', 'metropolitan', 'norfolk', 'north-wales', 'north-yorkshire', 'northamptonshire',
    'northumbria', 'northern-ireland', 'nottinghamshire', 'police-scotland', 'psni',
    'south-wales', 'south-yorkshire', 'staffordshire', 'suffolk', 'surrey', 'sussex',
    'thames-valley', 'warwickshire', 'west-mercia', 'west-midlands', 'west-yorkshire', 'wiltshire'
  ]
  
  // Define static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/statistics', priority: '0.9', changefreq: 'daily' },
    { url: '/analytics', priority: '0.8', changefreq: 'weekly' },
    { url: '/forces', priority: '0.7', changefreq: 'weekly' },
    { url: '/map', priority: '0.8', changefreq: 'daily' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/faq', priority: '0.4', changefreq: 'monthly' }
  ]
  
  // Generate XML sitemap
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>\n`
    sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`
    sitemap += `    <priority>${page.priority}</priority>\n`
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`
    sitemap += `  </url>\n`
  })
  
  // Add force-specific statistics pages
  forces.forEach(force => {
    sitemap += `  <url>\n`
    sitemap += `    <loc>${baseUrl}/statistics?force=${force}</loc>\n`
    sitemap += `    <priority>0.8</priority>\n`
    sitemap += `    <changefreq>daily</changefreq>\n`
    sitemap += `  </url>\n`
  })
  
  sitemap += '</urlset>'
  
  // Set response headers
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour
  
  return sitemap
})
