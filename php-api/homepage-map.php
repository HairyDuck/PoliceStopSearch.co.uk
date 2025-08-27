<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Cache file path - try multiple possible paths
$possibleCachePaths = [
    '../data/server-cache.json',
    '../../data/server-cache.json',
    dirname(__FILE__) . '/../data/server-cache.json',
    dirname(__FILE__) . '/../../data/server-cache.json',
    $_SERVER['DOCUMENT_ROOT'] . '/data/server-cache.json'
];

$cacheFile = null;
foreach ($possibleCachePaths as $path) {
    if (file_exists($path)) {
        $cacheFile = $path;
        break;
    }
}

if (!$cacheFile) {
    echo json_encode([
        'success' => false,
        'error' => 'No cache data available. Tried paths: ' . implode(', ', $possibleCachePaths),
        'summary' => [
            'totalForces' => 0,
            'activeForces' => 0,
            'limitedDataForces' => 0,
            'noDataForces' => 0,
            'transparencyIssues' => 0,
            'latestMonth' => 'Unknown'
        ],
        'forces' => [],
        'timestamp' => date('c')
    ]);
    exit();
}

$cacheData = file_get_contents($cacheFile);
$cache = json_decode($cacheData, true);

if (!$cache) {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid cache data',
        'summary' => [
            'totalForces' => 0,
            'activeForces' => 0,
            'limitedDataForces' => 0,
            'noDataForces' => 0,
            'transparencyIssues' => 0,
            'latestMonth' => 'Unknown'
        ],
        'forces' => [],
        'timestamp' => date('c')
    ]);
    exit();
}

// Function to format month string
function formatMonth($monthString) {
    if ($monthString === 'latest' || $monthString === null) {
        return 'Latest';
    }
    
    // Convert YYYY-MM to Month YYYY format
    if (preg_match('/^(\d{4})-(\d{2})$/', $monthString, $matches)) {
        $year = $matches[1];
        $month = intval($matches[2]);
        
        $monthNames = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'May', 6 => 'Jun', 7 => 'Jul', 8 => 'Aug',
            9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec'
        ];
        
        if (isset($monthNames[$month])) {
            return $monthNames[$month] . ' ' . $year;
        }
    }
    
    return $monthString;
}

// Load police forces data - try multiple possible paths
$possiblePaths = [
    '../police_forces.json',
    '../../police_forces.json',
    dirname(__FILE__) . '/../police_forces.json',
    dirname(__FILE__) . '/../../police_forces.json',
    $_SERVER['DOCUMENT_ROOT'] . '/police_forces.json'
];

$policeForcesFile = null;
foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        $policeForcesFile = $path;
        break;
    }
}

if (!$policeForcesFile) {
    echo json_encode([
        'success' => false,
        'error' => 'Police forces data not found. Tried paths: ' . implode(', ', $possiblePaths),
        'summary' => [
            'totalForces' => 0,
            'activeForces' => 0,
            'limitedDataForces' => 0,
            'noDataForces' => 0,
            'transparencyIssues' => 0,
            'latestMonth' => 'Unknown'
        ],
        'forces' => [],
        'timestamp' => date('c')
    ]);
    exit();
}

$forcesData = json_decode(file_get_contents($policeForcesFile), true);

// Force coordinates (approximate centers of UK police force areas)
$forceCoordinates = [
    'avon-and-somerset' => [51.4545, -2.5879],
    'bedfordshire' => [52.1364, -0.4661],
    'cambridgeshire' => [52.2053, 0.1218],
    'cheshire' => [53.1910, -2.5879],
    'city-of-london' => [51.5136, -0.0984],
    'cleveland' => [54.5260, -1.2346],
    'cumbria' => [54.5772, -2.7975],
    'derbyshire' => [53.1333, -1.5333],
    'devon-and-cornwall' => [50.3755, -4.1427],
    'dorset' => [50.7488, -2.3445],
    'durham' => [54.7761, -1.5733],
    'dyfed-powys' => [52.1307, -4.2763],
    'essex' => [51.7500, 0.5000],
    'gloucestershire' => [51.8642, -2.2380],
    'greater-manchester' => [53.4808, -2.2426],
    'gwent' => [51.6214, -3.9436],
    'hampshire' => [50.9097, -1.4044],
    'hertfordshire' => [51.8098, -0.2377],
    'humberside' => [53.7443, -0.3325],
    'kent' => [51.2787, 0.5217],
    'lancashire' => [53.7632, -2.7039],
    'leicestershire' => [52.6369, -1.1398],
    'lincolnshire' => [53.2307, -0.5406],
    'merseyside' => [53.4084, -2.9916],
    'metropolitan' => [51.5074, -0.1278],
    'norfolk' => [52.6143, 0.8888],
    'north-wales' => [53.1404, -3.7837],
    'north-yorkshire' => [54.0000, -1.5000],
    'northamptonshire' => [52.2333, -0.9000],
    'northern-ireland' => [54.7877, -6.4923],
    'northumbria' => [54.9783, -1.6178],
    'nottinghamshire' => [53.0000, -1.0000],
    'police-scotland' => [55.9533, -3.1883],
    'psni' => [54.7877, -6.4923],
    'south-wales' => [51.4816, -3.1791],
    'south-yorkshire' => [53.3811, -1.4701],
    'staffordshire' => [52.8833, -2.1333],
    'suffolk' => [52.1872, 0.9708],
    'surrey' => [51.2362, -0.5704],
    'sussex' => [50.8225, -0.1372],
    'thames-valley' => [51.4543, -0.9781],
    'warwickshire' => [52.2823, -1.5849],
    'west-mercia' => [52.1916, -2.2215],
    'west-midlands' => [52.4862, -1.8904],
    'west-yorkshire' => [53.8008, -1.5491],
    'wiltshire' => [51.3498, -1.9941]
];

// Analyze cache data for transparency issues
$forceData = [];
$forcesWithIssues = [];

// Process all cache entries
foreach ($cache as $key => $entry) {
    if (strpos($key, 'aggregated:') === 0) {
        $parts = explode(':', $key);
        if (count($parts) >= 3) {
            $forceId = $parts[1];
            $month = $parts[2];
            $data = $entry['data'] ?? null;
            
            if (!isset($forceData[$forceId])) {
                $forceData[$forceId] = [
                    'totalIncidents' => 0,
                    'monthsWithData' => 0,
                    'totalMonths' => 0,
                    'latestMonth' => null
                ];
            }
            
            $forceData[$forceId]['totalMonths']++;
            
            if ($data && isset($data['total']) && $data['total'] > 0) {
                $forceData[$forceId]['totalIncidents'] += $data['total'];
                $forceData[$forceId]['monthsWithData']++;
                
                // Track latest month with data (skip 'latest' entries)
                if ($month !== 'latest') {
                    if (!$forceData[$forceId]['latestMonth'] || $month > $forceData[$forceId]['latestMonth']) {
                        $forceData[$forceId]['latestMonth'] = $month;
                    }
                }
            }
        }
    }
}

// Identify forces with transparency issues
foreach ($forceData as $forceId => $stats) {
    if ($stats['totalIncidents'] === 0 || ($stats['monthsWithData'] / $stats['totalMonths']) < 0.1) {
        $forcesWithIssues[] = $forceId;
    }
}

// Create forces list with real data
$forces = [];
$activeCount = 0;
$limitedCount = 0;
$noDataCount = 0;
$latestMonth = 'Unknown';

foreach ($forcesData as $forceId => $forceInfo) {
    $coordinates = $forceCoordinates[$forceId] ?? null;
    $hasTransparencyIssues = in_array($forceId, $forcesWithIssues);
    $forceStats = $forceData[$forceId] ?? ['totalIncidents' => 0, 'monthsWithData' => 0, 'totalMonths' => 0, 'latestMonth' => null];
    
               // Determine status based on real cache data
           $status = 'none';
           $latestMonthForForce = null;
           $totalIncidents = $forceStats['totalIncidents'] ?? 0;
           $monthsWithData = $forceStats['monthsWithData'] ?? 0;

           if ($hasTransparencyIssues) {
               $status = 'none';
               $latestMonthForForce = null;
               $totalIncidents = 0;
               $noDataCount++;
           } else if ($monthsWithData >= 11 && $forceStats['totalIncidents'] > 100) {
               $status = 'active';
               $latestMonthForForce = formatMonth($forceStats['latestMonth'] ?? 'latest');
               $activeCount++;
           } else if ($forceStats['totalIncidents'] > 0) {
               $status = 'limited';
               $latestMonthForForce = formatMonth($forceStats['latestMonth'] ?? 'latest');
               $limitedCount++;
           } else {
               $status = 'none';
               $noDataCount++;
           }
    
    // Update latest month if we found more recent data
    if ($forceStats['latestMonth'] && $forceStats['latestMonth'] !== 'latest') {
        if ($latestMonth === 'Unknown' || $forceStats['latestMonth'] > $latestMonth) {
            $latestMonth = formatMonth($forceStats['latestMonth']);
        }
    }
    
    $forces[] = [
        'id' => $forceId,
        'name' => $forceInfo['name'],
        'status' => $status,
        'latestMonth' => $latestMonthForForce,
        'totalIncidents' => $totalIncidents,
        'coordinates' => $coordinates,
        'hasTransparencyIssues' => $hasTransparencyIssues
    ];
}

// Sort forces by status (active first, then limited, then none)
usort($forces, function($a, $b) {
    $statusOrder = ['active' => 0, 'limited' => 1, 'none' => 2];
    return $statusOrder[$a['status']] - $statusOrder[$b['status']];
});

// Create summary
$summary = [
    'totalForces' => count($forces),
    'activeForces' => $activeCount,
    'limitedDataForces' => $limitedCount,
    'noDataForces' => $noDataCount,
    'transparencyIssues' => count($forcesWithIssues),
    'latestMonth' => $latestMonth
];

echo json_encode([
    'success' => true,
    'summary' => $summary,
    'forces' => $forces,
    'timestamp' => date('c')
]);
?>
