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

// Cache file path
$cacheFile = '../data/server-cache.json';

if (!file_exists($cacheFile)) {
    echo json_encode(['forcesWithIssues' => [], 'analysis' => []]);
    exit();
}

$cacheData = file_get_contents($cacheFile);
$cache = json_decode($cacheData, true);

if (!$cache) {
    echo json_encode(['forcesWithIssues' => [], 'analysis' => []]);
    exit();
}

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
                    'totalMonths' => 0
                ];
            }
            
            $forceData[$forceId]['totalMonths']++;
            
            if ($data && isset($data['total']) && $data['total'] > 0) {
                $forceData[$forceId]['totalIncidents'] += $data['total'];
                $forceData[$forceId]['monthsWithData']++;
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

echo json_encode([
    'forcesWithIssues' => $forcesWithIssues,
    'analysis' => $forceData
]);
?>
