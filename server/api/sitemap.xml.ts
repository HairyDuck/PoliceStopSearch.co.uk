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
    
    // Define all available police forces
    const policeForces = [
      { id: 'avon-and-somerset', name: 'Avon and Somerset Police' },
      { id: 'bedfordshire', name: 'Bedfordshire Police' },
      { id: 'cambridgeshire', name: 'Cambridgeshire Police' },
      { id: 'cheshire', name: 'Cheshire Police' },
      { id: 'city-of-london', name: 'City of London Police' },
      { id: 'cleveland', name: 'Cleveland Police' },
      { id: 'cumbria', name: 'Cumbria Police' },
      { id: 'derbyshire', name: 'Derbyshire Police' },
      { id: 'devon-and-cornwall', name: 'Devon and Cornwall Police' },
      { id: 'dorset', name: 'Dorset Police' },
      { id: 'durham', name: 'Durham Police' },
      { id: 'dyfed-powys', name: 'Dyfed-Powys Police' },
      { id: 'essex', name: 'Essex Police' },
      { id: 'gloucestershire', name: 'Gloucestershire Police' },
      { id: 'greater-manchester', name: 'Greater Manchester Police' },
      { id: 'gwent', name: 'Gwent Police' },
      { id: 'hampshire', name: 'Hampshire Police' },
      { id: 'hertfordshire', name: 'Hertfordshire Police' },
      { id: 'kent', name: 'Kent Police' },
      { id: 'lancashire', name: 'Lancashire Police' },
      { id: 'leicestershire', name: 'Leicestershire Police' },
      { id: 'merseyside', name: 'Merseyside Police' },
      { id: 'metropolitan', name: 'Metropolitan Police' },
      { id: 'norfolk', name: 'Norfolk Police' },
      { id: 'north-wales', name: 'North Wales Police' },
      { id: 'north-yorkshire', name: 'North Yorkshire Police' },
      { id: 'northamptonshire', name: 'Northamptonshire Police' },
      { id: 'northumbria', name: 'Northumbria Police' },
      { id: 'nottinghamshire', name: 'Nottinghamshire Police' },
      { id: 'south-wales', name: 'South Wales Police' },
      { id: 'south-yorkshire', name: 'South Yorkshire Police' },
      { id: 'staffordshire', name: 'Staffordshire Police' },
      { id: 'suffolk', name: 'Suffolk Police' },
      { id: 'surrey', name: 'Surrey Police' },
      { id: 'sussex', name: 'Sussex Police' },
      { id: 'thames-valley', name: 'Thames Valley Police' },
      { id: 'warwickshire', name: 'Warwickshire Police' },
      { id: 'west-mercia', name: 'West Mercia Police' },
      { id: 'west-midlands', name: 'West Midlands Police' },
      { id: 'west-yorkshire', name: 'West Yorkshire Police' },
      { id: 'wiltshire', name: 'Wiltshire Police' }
    ]
    
    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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
    <loc>https://policestopsearch.co.uk/analytics</loc>
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
  </url>`

    // Add force-specific statistics pages
    policeForces.forEach(force => {
      sitemap += `
  <url>
    <loc>https://policestopsearch.co.uk/statistics?force=${force.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${latestDate ? new Date(latestDate + '-01').toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
  </url>`
    })

    sitemap += `
</urlset>`
    
    return sitemap
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error)
    
    // Fallback to static sitemap if API fails
    let fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
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
    <loc>https://policestopsearch.co.uk/analytics</loc>
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
  </url>`

    // Add force-specific statistics pages to fallback
    policeForces.forEach(force => {
      fallbackSitemap += `
  <url>
    <loc>https://policestopsearch.co.uk/statistics?force=${force.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`
    })

    fallbackSitemap += `
</urlset>`
    
    return fallbackSitemap
  }
})
