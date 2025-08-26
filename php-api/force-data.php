<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

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
        'mostCommonObjectCount' => 0,
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
    
    // Process other fields as needed
    // Add more processing logic here based on your needs
}

if ($processedData['total'] > 0) {
    $processedData['arrestsPercentage'] = ($processedData['arrests'] / $processedData['total']) * 100;
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
