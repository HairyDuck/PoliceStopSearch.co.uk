<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$cacheDir = __DIR__ . '/cache/';
$cacheExpiry = 3600; // 1 hour

// Ensure cache directory exists
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

// Also ensure the parent data directory exists for compatibility
$parentDataDir = __DIR__ . '/../data/';
if (!is_dir($parentDataDir)) {
    mkdir($parentDataDir, 0755, true);
}

// Get request parameters
$action = $_GET['action'] ?? 'get';
$force = $_GET['force'] ?? null;
$month = $_GET['month'] ?? 'latest';

// Function to get cache key
function getCacheKey($force = null, $month = 'latest') {
    if ($force) {
        return "statistics_force_{$force}_{$month}";
    }
    return "statistics_overall_{$month}";
}

// Function to get cached data
function getCached($key) {
    global $cacheDir, $cacheExpiry;
    $file = $cacheDir . md5($key) . '.json';
    
    if (file_exists($file) && (time() - filemtime($file)) < $cacheExpiry) {
        $data = json_decode(file_get_contents($file), true);
        if ($data) {
            return $data;
        }
    }
    return null;
}

// Function to save cache
function saveCache($key, $data) {
    global $cacheDir;
    $file = $cacheDir . md5($key) . '.json';
    file_put_contents($file, json_encode($data));
}

// Function to fetch and aggregate force data
function fetchForceStatistics($forceId, $month = 'latest') {
    // Determine the date range
    if ($month === 'latest') {
        $date = new DateTime();
        $date->modify('-1 month');
        $year = $date->format('Y');
        $monthNum = $date->format('m');
    } else {
        $parts = explode('-', $month);
        $year = $parts[0];
        $monthNum = $parts[1];
    }
    
    $dateStr = $year . '-' . $monthNum;
    
    // Fetch data from the police API
    $url = "https://data.police.uk/api/stops-force?force={$forceId}&date={$dateStr}";
    $response = file_get_contents($url);
    
    if (!$response) {
        return null;
    }
    
    $incidents = json_decode($response, true);
    if (!$incidents || !is_array($incidents)) {
        return null;
    }
    
    // Aggregate statistics
    $stats = [
        'force_id' => $forceId,
        'month' => $dateStr,
        'total_incidents' => count($incidents),
        'arrests' => 0,
        'no_further_action' => 0,
        'outcomes' => [],
        'ethnicityBreakdown' => [],
        'genderBreakdown' => [],
        'ageBreakdown' => [],
        'objectOfSearch' => [],
        'legislation' => [],
        'byHour' => [],
        'byDay' => [],
        'locations' => []
    ];
    
    $locationCounts = [];
    
    foreach ($incidents as $incident) {
        // Process outcomes
        $outcome = $incident['outcome'] ?? 'Not Recorded';
        $stats['outcomes'][$outcome] = ($stats['outcomes'][$outcome] ?? 0) + 1;
        
        if (stripos($outcome, 'arrest') !== false) {
            $stats['arrests']++;
        } elseif (stripos($outcome, 'no further action') !== false) {
            $stats['no_further_action']++;
        }
        
        // Process ethnicity
        $ethnicity = $incident['self_defined_ethnicity'] ?? $incident['officer_defined_ethnicity'] ?? 'Not Recorded';
        $stats['ethnicityBreakdown'][$ethnicity] = ($stats['ethnicityBreakdown'][$ethnicity] ?? 0) + 1;
        
        // Process gender
        $gender = $incident['gender'] ?? 'Not Recorded';
        $stats['genderBreakdown'][$gender] = ($stats['genderBreakdown'][$gender] ?? 0) + 1;
        
        // Process age
        $age = $incident['age_range'] ?? 'Not Recorded';
        $stats['ageBreakdown'][$age] = ($stats['ageBreakdown'][$age] ?? 0) + 1;
        
        // Process object of search
        $object = $incident['object_of_search'] ?? 'Not Recorded';
        $stats['objectOfSearch'][$object] = ($stats['objectOfSearch'][$object] ?? 0) + 1;
        
        // Process legislation
        $legislation = $incident['legislation'] ?? 'Not Recorded';
        $stats['legislation'][$legislation] = ($stats['legislation'][$legislation] ?? 0) + 1;
        
        // Process datetime for time analysis
        if (!empty($incident['datetime'])) {
            $timestamp = strtotime($incident['datetime']);
            if ($timestamp !== false) {
                $hour = date('G', $timestamp); // 0-23
                $stats['byHour'][$hour] = ($stats['byHour'][$hour] ?? 0) + 1;
                
                $dayOfWeek = date('l', $timestamp); // Monday, Tuesday, etc.
                $stats['byDay'][$dayOfWeek] = ($stats['byDay'][$dayOfWeek] ?? 0) + 1;
            }
        }
        
        // Process location
        if (!empty($incident['location']['latitude']) && !empty($incident['location']['longitude'])) {
            $lat = round($incident['location']['latitude'], 3);
            $lng = round($incident['location']['longitude'], 3);
            $locationKey = "{$lat},{$lng}";
            
            if (!isset($locationCounts[$locationKey])) {
                $locationCounts[$locationKey] = [
                    'lat' => $lat,
                    'lng' => $lng,
                    'count' => 0,
                    'name' => $incident['location']['street']['name'] ?? 'Unknown Location'
                ];
            }
            $locationCounts[$locationKey]['count']++;
        }
    }
    
    // Convert location counts to array
    $stats['locations'] = array_values($locationCounts);
    
    return $stats;
}

// Function to get overall statistics
function getOverallStatistics($month = 'latest') {
    // Get all available forces
    $forces = [
        'avon-and-somerset', 'bedfordshire', 'cambridgeshire', 'cheshire', 'city-of-london',
        'cleveland', 'cumbria', 'derbyshire', 'devon-and-cornwall', 'dorset', 'durham',
        'dyfed-powys', 'essex', 'gloucestershire', 'greater-manchester', 'gwent', 'hampshire',
        'hertfordshire', 'kent', 'lancashire', 'leicestershire', 'merseyside', 'metropolitan',
        'norfolk', 'north-wales', 'north-yorkshire', 'northamptonshire', 'northumbria',
        'nottinghamshire', 'south-wales', 'south-yorkshire', 'staffordshire', 'suffolk',
        'surrey', 'sussex', 'thames-valley', 'warwickshire', 'west-mercia', 'west-midlands',
        'west-yorkshire', 'wiltshire'
    ];
    
    $overallStats = [
        'month' => $month,
        'total_incidents' => 0,
        'total_arrests' => 0,
        'total_no_further_action' => 0,
        'forces_analyzed' => 0,
        'forces' => [],
        'overall_breakdowns' => [
            'outcomes' => [],
            'ethnicity' => [],
            'gender' => [],
            'age' => [],
            'objectOfSearch' => [],
            'legislation' => [],
            'byHour' => [],
            'byDay' => []
        ]
    ];
    
    foreach ($forces as $forceId) {
        $forceStats = fetchForceStatistics($forceId, $month);
        if ($forceStats && $forceStats['total_incidents'] > 0) {
            $overallStats['forces'][] = $forceStats;
            $overallStats['total_incidents'] += $forceStats['total_incidents'];
            $overallStats['total_arrests'] += $forceStats['arrests'];
            $overallStats['total_no_further_action'] += $forceStats['no_further_action'];
            $overallStats['forces_analyzed']++;
            
            // Aggregate breakdowns
            foreach ($forceStats['outcomes'] as $outcome => $count) {
                $overallStats['overall_breakdowns']['outcomes'][$outcome] = 
                    ($overallStats['overall_breakdowns']['outcomes'][$outcome] ?? 0) + $count;
            }
            
            foreach ($forceStats['ethnicityBreakdown'] as $ethnicity => $count) {
                $overallStats['overall_breakdowns']['ethnicity'][$ethnicity] = 
                    ($overallStats['overall_breakdowns']['ethnicity'][$ethnicity] ?? 0) + $count;
            }
            
            foreach ($forceStats['genderBreakdown'] as $gender => $count) {
                $overallStats['overall_breakdowns']['gender'][$gender] = 
                    ($overallStats['overall_breakdowns']['gender'][$gender] ?? 0) + $count;
            }
            
            foreach ($forceStats['ageBreakdown'] as $age => $count) {
                $overallStats['overall_breakdowns']['age'][$age] = 
                    ($overallStats['overall_breakdowns']['age'][$age] ?? 0) + $count;
            }
            
            foreach ($forceStats['objectOfSearch'] as $object => $count) {
                $overallStats['overall_breakdowns']['objectOfSearch'][$object] = 
                    ($overallStats['overall_breakdowns']['objectOfSearch'][$object] ?? 0) + $count;
            }
            
            foreach ($forceStats['legislation'] as $legislation => $count) {
                $overallStats['overall_breakdowns']['legislation'][$legislation] = 
                    ($overallStats['overall_breakdowns']['legislation'][$legislation] ?? 0) + $count;
            }
            
            foreach ($forceStats['byHour'] as $hour => $count) {
                $overallStats['overall_breakdowns']['byHour'][$hour] = 
                    ($overallStats['overall_breakdowns']['byHour'][$hour] ?? 0) + $count;
            }
            
            foreach ($forceStats['byDay'] as $day => $count) {
                $overallStats['overall_breakdowns']['byDay'][$day] = 
                    ($overallStats['overall_breakdowns']['byDay'][$day] ?? 0) + $count;
            }
        }
    }
    
    return $overallStats;
}

// Handle different actions
switch ($action) {
    case 'get':
        if ($force) {
            // Get force-specific statistics
            $cacheKey = getCacheKey($force, $month);
            $cached = getCached($cacheKey);
            
            if ($cached) {
                echo json_encode(['cached' => true, 'data' => $cached]);
            } else {
                $data = fetchForceStatistics($force, $month);
                if ($data) {
                    saveCache($cacheKey, $data);
                    echo json_encode(['cached' => false, 'data' => $data]);
                } else {
                    echo json_encode(['error' => 'No data available for this force and month']);
                }
            }
        } else {
            // Get overall statistics
            $cacheKey = getCacheKey(null, $month);
            $cached = getCached($cacheKey);
            
            if ($cached) {
                echo json_encode(['cached' => true, 'data' => $cached]);
            } else {
                $data = getOverallStatistics($month);
                if ($data) {
                    saveCache($cacheKey, $data);
                    echo json_encode(['cached' => false, 'data' => $data]);
                } else {
                    echo json_encode(['error' => 'No data available for this month']);
                }
            }
        }
        break;
        
    case 'clear':
        // Clear cache
        $files = glob($cacheDir . '*.json');
        foreach ($files as $file) {
            unlink($file);
        }
        echo json_encode(['message' => 'Cache cleared']);
        break;
        
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?>
