export default defineEventHandler(async (event) => {
  // Set content type to XML
  setHeader(event, 'Content-Type', 'application/xml')
  
  try {
    // Fetch available datasets from the police API
    const response = await $fetch('https://data.police.uk/api/crimes-street-dates')
    
    if (!Array.isArray(response)) {
      throw new Error('Invalid response from police API')
    }
    
    // Filter for datasets with stop and search data
    const availableDatasets = response.filter((dataset: any) => 
      dataset.date && dataset['stop-and-search'] && dataset['stop-and-search'].length > 0
    )
    
    // Get the latest available date
    const latestDate = availableDatasets.length > 0 ? availableDatasets[0].date : null
    
    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://policestopsearch.co.uk/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/map</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <lastmod>${latestDate ? new Date(latestDate + '-01').toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/statistics</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <lastmod>${latestDate ? new Date(latestDate + '-01').toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/forces</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>2025-02-07</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>2025-02-07</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>2025-02-07</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>2025-02-07</lastmod>
  </url>
</urlset>`
    
    return sitemap
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error)
    
    // Fallback to static sitemap if API fails
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://policestopsearch.co.uk/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/map</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/statistics</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/forces</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>2025-02-07</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>2025-02-07</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>2025-02-07</lastmod>
  </url>
  <url>
    <loc>https://policestopsearch.co.uk/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>2025-02-07</lastmod>
  </url>
</urlset>`
    
    return fallbackSitemap
  }
})
