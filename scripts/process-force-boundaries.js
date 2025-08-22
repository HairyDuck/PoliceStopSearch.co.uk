const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FORCE_KMLS_DIR = path.join(__dirname, '../boundries/force_kmls');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const SIMPLIFIED_DIR = path.join(OUTPUT_DIR, 'simplified');

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(SIMPLIFIED_DIR)) {
  fs.mkdirSync(SIMPLIFIED_DIR, { recursive: true });
}

// Force ID mapping to match our existing force IDs
const forceIdMapping = {
  'avon-and-somerset': 'avon-and-somerset',
  'bedfordshire': 'bedfordshire',
  'cambridgeshire': 'cambridgeshire',
  'cheshire': 'cheshire',
  'city-of-london': 'city-of-london',
  'cleveland': 'cleveland',
  'cumbria': 'cumbria',
  'derbyshire': 'derbyshire',
  'devon-and-cornwall': 'devon-and-cornwall',
  'dorset': 'dorset',
  'durham': 'durham',
  'dyfed-powys': 'dyfed-powys',
  'essex': 'essex',
  'gloucestershire': 'gloucestershire',
  'greater-manchester': 'greater-manchester',
  'gwent': 'gwent',
  'hampshire': 'hampshire',
  'hertfordshire': 'hertfordshire',
  'humberside': 'humberside',
  'kent': 'kent',
  'lancashire': 'lancashire',
  'leicestershire': 'leicestershire',
  'lincolnshire': 'lincolnshire',
  'merseyside': 'merseyside',
  'metropolitan': 'metropolitan',
  'norfolk': 'norfolk',
  'north-wales': 'north-wales',
  'north-yorkshire': 'north-yorkshire',
  'northamptonshire': 'northamptonshire',
  'northumbria': 'northumbria',
  'northern-ireland': 'northern-ireland',
  'nottinghamshire': 'nottinghamshire',
  'south-wales': 'south-wales',
  'south-yorkshire': 'south-yorkshire',
  'staffordshire': 'staffordshire',
  'suffolk': 'suffolk',
  'surrey': 'surrey',
  'sussex': 'sussex',
  'thames-valley': 'thames-valley',
  'warwickshire': 'warwickshire',
  'west-mercia': 'west-mercia',
  'west-midlands': 'west-midlands',
  'west-yorkshire': 'west-yorkshire',
  'wiltshire': 'wiltshire'
};

async function processForceBoundaries() {
  console.log('🚀 Starting force boundary processing...');
  
  const kmlFiles = fs.readdirSync(FORCE_KMLS_DIR).filter(file => file.endsWith('.kml'));
  console.log(`📁 Found ${kmlFiles.length} KML files to process`);
  
  const processedForces = [];
  
  for (const kmlFile of kmlFiles) {
    const forceId = kmlFile.replace('.kml', '');
    const mappedForceId = forceIdMapping[forceId];
    
    if (!mappedForceId) {
      console.warn(`⚠️ No mapping found for force: ${forceId}`);
      continue;
    }
    
    const inputPath = path.join(FORCE_KMLS_DIR, kmlFile);
    const outputPath = path.join(SIMPLIFIED_DIR, `${mappedForceId}.geojson`);
    
    try {
      console.log(`🔄 Processing ${forceId}...`);
      
      // Use mapshaper to simplify and convert KML to GeoJSON
      // -simplify 10% reduces complexity by 90%
      // -o format=geojson outputs as GeoJSON
      const command = `mapshaper "${inputPath}" -simplify 10% -o format=geojson "${outputPath}"`;
      
      execSync(command, { stdio: 'pipe' });
      
      // Read the generated file and add force metadata
      const geojson = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      
      // Add force properties to each feature
      geojson.features.forEach(feature => {
        feature.properties = {
          ...feature.properties,
          force_id: mappedForceId,
          force_name: getForceName(mappedForceId)
        };
      });
      
      // Write back the enhanced GeoJSON
      fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
      
      // Get file size info
      const originalSize = fs.statSync(inputPath).size;
      const simplifiedSize = fs.statSync(outputPath).size;
      const reduction = ((originalSize - simplifiedSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${forceId}: ${(originalSize/1024).toFixed(0)}KB → ${(simplifiedSize/1024).toFixed(0)}KB (${reduction}% reduction)`);
      
      processedForces.push({
        force_id: mappedForceId,
        force_name: getForceName(mappedForceId),
        file: `${mappedForceId}.geojson`,
        original_size: originalSize,
        simplified_size: simplifiedSize,
        reduction_percent: parseFloat(reduction)
      });
      
    } catch (error) {
      console.error(`❌ Error processing ${forceId}:`, error.message);
    }
  }
  
  // Create a combined GeoJSON file with all forces
  console.log('🔗 Creating combined GeoJSON file...');
  const combinedFeatures = [];
  
  for (const force of processedForces) {
    const forcePath = path.join(SIMPLIFIED_DIR, force.file);
    if (fs.existsSync(forcePath)) {
      const geojson = JSON.parse(fs.readFileSync(forcePath, 'utf8'));
      combinedFeatures.push(...geojson.features);
    }
  }
  
  const combinedGeoJSON = {
    type: 'FeatureCollection',
    features: combinedFeatures
  };
  
  const combinedPath = path.join(OUTPUT_DIR, 'uk-police-forces.geojson');
  fs.writeFileSync(combinedPath, JSON.stringify(combinedGeoJSON, null, 2));
  
  // Create a summary file
  const summary = {
    processed_at: new Date().toISOString(),
    total_forces: processedForces.length,
    forces: processedForces,
    combined_file: 'uk-police-forces.geojson',
    total_original_size: processedForces.reduce((sum, f) => sum + f.original_size, 0),
    total_simplified_size: processedForces.reduce((sum, f) => sum + f.simplified_size, 0),
    average_reduction: (processedForces.reduce((sum, f) => sum + f.reduction_percent, 0) / processedForces.length).toFixed(1)
  };
  
  const summaryPath = path.join(OUTPUT_DIR, 'force-boundaries-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log('\n🎉 Processing complete!');
  console.log(`📊 Processed ${processedForces.length} forces`);
  console.log(`📁 Individual files: ${SIMPLIFIED_DIR}/`);
  console.log(`🔗 Combined file: ${combinedPath}`);
  console.log(`📋 Summary: ${summaryPath}`);
  console.log(`💾 Average size reduction: ${summary.average_reduction}%`);
  
  return summary;
}

function getForceName(forceId) {
  const forceNames = {
    'avon-and-somerset': 'Avon and Somerset Police',
    'bedfordshire': 'Bedfordshire Police',
    'cambridgeshire': 'Cambridgeshire Constabulary',
    'cheshire': 'Cheshire Constabulary',
    'city-of-london': 'City of London Police',
    'cleveland': 'Cleveland Police',
    'cumbria': 'Cumbria Constabulary',
    'derbyshire': 'Derbyshire Constabulary',
    'devon-and-cornwall': 'Devon and Cornwall Police',
    'dorset': 'Dorset Police',
    'durham': 'Durham Constabulary',
    'dyfed-powys': 'Dyfed-Powys Police',
    'essex': 'Essex Police',
    'gloucestershire': 'Gloucestershire Constabulary',
    'greater-manchester': 'Greater Manchester Police',
    'gwent': 'Gwent Police',
    'hampshire': 'Hampshire Constabulary',
    'hertfordshire': 'Hertfordshire Constabulary',
    'humberside': 'Humberside Police',
    'kent': 'Kent Police',
    'lancashire': 'Lancashire Constabulary',
    'leicestershire': 'Leicestershire Police',
    'lincolnshire': 'Lincolnshire Police',
    'merseyside': 'Merseyside Police',
    'metropolitan': 'Metropolitan Police Service',
    'norfolk': 'Norfolk Constabulary',
    'north-wales': 'North Wales Police',
    'north-yorkshire': 'North Yorkshire Police',
    'northamptonshire': 'Northamptonshire Police',
    'northumbria': 'Northumbria Police',
    'northern-ireland': 'Police Service of Northern Ireland',
    'nottinghamshire': 'Nottinghamshire Police',
    'south-wales': 'South Wales Police',
    'south-yorkshire': 'South Yorkshire Police',
    'staffordshire': 'Staffordshire Police',
    'suffolk': 'Suffolk Constabulary',
    'surrey': 'Surrey Police',
    'sussex': 'Sussex Police',
    'thames-valley': 'Thames Valley Police',
    'warwickshire': 'Warwickshire Police',
    'west-mercia': 'West Mercia Police',
    'west-midlands': 'West Midlands Police',
    'west-yorkshire': 'West Yorkshire Police',
    'wiltshire': 'Wiltshire Police'
  };
  
  return forceNames[forceId] || forceId;
}

// Run the processing
if (require.main === module) {
  processForceBoundaries().catch(console.error);
}

module.exports = { processForceBoundaries };
