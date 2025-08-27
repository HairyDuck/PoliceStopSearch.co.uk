<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$force = $_GET['force'] ?? null;
$date = $_GET['date'] ?? null;

if (!$force) {
    http_response_code(400);
    echo json_encode(['error' => 'Force parameter is required']);
    exit();
}

// Cache file path
$cacheFile = '../data/server-cache.json';

// Load cache
function loadCache() {
    global $cacheFile;
    if (file_exists($cacheFile)) {
        $data = file_get_contents($cacheFile);
        return json_decode($data, true) ?: [];
    }
    return [];
}

// Save cache
function saveCache($cache) {
    global $cacheFile;
    file_put_contents($cacheFile, json_encode($cache, JSON_PRETTY_PRINT));
}

// Check cache first
$cache = loadCache();
$cacheKey = "aggregated:{$force}:" . ($date ?: 'latest');

if (isset($cache[$cacheKey]) && isset($cache[$cacheKey]['data'])) {
    echo json_encode($cache[$cacheKey]['data']);
    exit();
}

// Fetch from external API
$forceUrl = "https://data.police.uk/api/stops-force?force={$force}";
if ($date) {
    $forceUrl .= "&date={$date}";
}

$context = stream_context_create([
    'http' => [
        'timeout' => 30,
        'user_agent' => 'PoliceStopSearch.co.uk/1.0'
    ]
]);

$response = file_get_contents($forceUrl, false, $context);

if ($response === false) {
    // Return fallback data
    $fallbackData = [
        'forceId' => $force,
        'forceName' => $force,
        'month' => $date ?: '',
        'total' => 0,
        'arrests' => 0,
        'noAction' => 0,
        'warnings' => 0,
        'other' => 0,
        'arrestsPercentage' => 0,
        'ethnicityBreakdown' => [],
        'genderBreakdown' => [],
        'ageBreakdown' => [],
        'legislation' => [],
        'objectOfSearch' => [],
        'typeBreakdown' => [],
        'byHour' => [],
        'byDay' => [],
        'locations' => [],
        'fallback' => true
    ];
    
    echo json_encode($fallbackData);
    exit();
}

$rawData = json_decode($response, true);

if (!is_array($rawData)) {
    $rawData = [];
}



// Process the data
$processedData = [
    'forceId' => $force,
    'forceName' => $force,
    'month' => $date ?: '',
    'total' => count($rawData),
    'arrests' => 0,
    'arrestsPercentage' => 0,
    'outcomes' => [],
    'ageBreakdown' => [],
    'genderBreakdown' => [],
    'ethnicityBreakdown' => [],
    'objectOfSearch' => [],
    'legislation' => [],
    'locationBreakdown' => [],
    'byHour' => [],
    'byDay' => [],
    'byMonth' => [],
    'mostCommonObject' => 'None',
    'mostCommonObjectCount' => 0
];

// Process each incident
foreach ($rawData as $incident) {
    // Count arrests
    if (isset($incident['outcome']) && strpos($incident['outcome'], 'Arrest') !== false) {
        $processedData['arrests']++;
    }
    
    // Process ethnicity
    $ethnicity = $incident['officer_defined_ethnicity'] ?? 'Unknown';
    $processedData['ethnicityBreakdown'][$ethnicity] = ($processedData['ethnicityBreakdown'][$ethnicity] ?? 0) + 1;
    
    // Process gender
    $gender = $incident['gender'] ?? 'Unknown';
    $processedData['genderBreakdown'][$gender] = ($processedData['genderBreakdown'][$gender] ?? 0) + 1;
    
    // Process age range
    $ageRange = $incident['age_range'] ?? 'Unknown';
    $processedData['ageBreakdown'][$ageRange] = ($processedData['ageBreakdown'][$ageRange] ?? 0) + 1;
    
    // Process legislation
    $legislation = $incident['legislation'] ?? 'Unknown';
    $processedData['legislation'][$legislation] = ($processedData['legislation'][$legislation] ?? 0) + 1;
    
    // Process object of search
    $objectOfSearch = $incident['object_of_search'] ?? 'Unknown';
    $processedData['objectOfSearch'][$objectOfSearch] = ($processedData['objectOfSearch'][$objectOfSearch] ?? 0) + 1;
    
    // Process type
    $type = $incident['type'] ?? 'Unknown';
    $processedData['typeBreakdown'][$type] = ($processedData['typeBreakdown'][$type] ?? 0) + 1;
    
    // Process hour
    if (isset($incident['datetime']) && !empty($incident['datetime'])) {
        $timestamp = strtotime($incident['datetime']);
        if ($timestamp !== false) {
            $hour = date('H', $timestamp);
            $processedData['byHour'][$hour] = ($processedData['byHour'][$hour] ?? 0) + 1;
        }
    }
    
    // Process day of week
    if (isset($incident['datetime']) && !empty($incident['datetime'])) {
        $timestamp = strtotime($incident['datetime']);
        if ($timestamp !== false) {
            $day = date('l', $timestamp);
            $processedData['byDay'][$day] = ($processedData['byDay'][$day] ?? 0) + 1;
        }
    }
    
    // Process location data
    if (isset($incident['location']['latitude']) && isset($incident['location']['longitude'])) {
        $lat = round($incident['location']['latitude'], 3);
        $lng = round($incident['location']['longitude'], 3);
        $locationKey = "{$lat},{$lng}";
        
        if (!isset($processedData['locationBreakdown'][$locationKey])) {
            $processedData['locationBreakdown'][$locationKey] = [
                'lat' => $incident['location']['latitude'],
                'lng' => $incident['location']['longitude'],
                'count' => 0
            ];
        }
        $processedData['locationBreakdown'][$locationKey]['count']++;
    }
}

if ($processedData['total'] > 0) {
    $processedData['arrestsPercentage'] = ($processedData['arrests'] / $processedData['total']) * 100;
    
    // Calculate other outcomes
    $processedData['noAction'] = 0;
    $processedData['warnings'] = 0;
    $processedData['other'] = 0;
    
    foreach ($rawData as $incident) {
        $outcome = $incident['outcome'] ?? '';
        if (strpos($outcome, 'No further action') !== false) {
            $processedData['noAction']++;
        } elseif (strpos($outcome, 'Warning') !== false) {
            $processedData['warnings']++;
        } else {
            $processedData['other']++;
        }
    }
    
    // Convert location breakdown to array format
    $processedData['locations'] = array_values($processedData['locationBreakdown']);
    unset($processedData['locationBreakdown']);
}

// Cache the processed data
$cache[$cacheKey] = [
    'data' => $processedData,
    'timestamp' => time() * 1000,
    'ttl' => 7776000000, // 90 days
    'source' => 'force-api'
];

saveCache($cache);



echo json_encode($processedData);
?>
