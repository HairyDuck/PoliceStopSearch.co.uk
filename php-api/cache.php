<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Cache file path
$cacheFile = '../data/server-cache.json';

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request data
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? ($_POST['action'] ?? null);

// Load cache from file
function loadCache() {
    global $cacheFile;
    if (file_exists($cacheFile)) {
        $data = file_get_contents($cacheFile);
        return json_decode($data, true) ?: [];
    }
    return [];
}

// Save cache to file
function saveCache($cache) {
    global $cacheFile;
    file_put_contents($cacheFile, json_encode($cache, JSON_PRETTY_PRINT));
}

// Handle different actions
switch ($action) {
    case 'stats':
        $cache = loadCache();
        $stats = [
            'size' => count($cache),
            'maxSize' => 2000,
            'keys' => array_keys($cache),
            'oldestEntry' => null,
            'newestEntry' => null
        ];
        
        if (!empty($cache)) {
            $timestamps = array_column($cache, 'timestamp');
            $oldestKey = array_keys($cache, min($cache))[0];
            $newestKey = array_keys($cache, max($cache))[0];
            
            $stats['oldestEntry'] = ['key' => $oldestKey, 'timestamp' => $cache[$oldestKey]['timestamp']];
            $stats['newestEntry'] = ['key' => $newestKey, 'timestamp' => $cache[$newestKey]['timestamp']];
        }
        
        echo json_encode($stats);
        break;
        
    case 'get':
        $key = $_GET['key'] ?? $_POST['key'] ?? null;
        if (!$key) {
            http_response_code(400);
            echo json_encode(['error' => 'Key is required for get action']);
            exit();
        }
        
        $cache = loadCache();
        if (isset($cache[$key])) {
            $entry = $cache[$key];
            if (time() - $entry['timestamp'] <= $entry['ttl']) {
                echo json_encode(['cached' => true, 'data' => $entry['data']]);
            } else {
                unset($cache[$key]);
                saveCache($cache);
                echo json_encode(['cached' => false, 'data' => null]);
            }
        } else {
            echo json_encode(['cached' => false, 'data' => null]);
        }
        break;
        
    case 'set':
        $key = $_GET['key'] ?? $_POST['key'] ?? null;
        $data = $_GET['data'] ?? $_POST['data'] ?? null;
        $ttl = $_GET['ttl'] ?? $_POST['ttl'] ?? 7776000000; // 90 days default
        
        if (!$key || !$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Key and data are required for set action']);
            exit();
        }
        
        $cache = loadCache();
        $cache[$key] = [
            'data' => json_decode($data, true),
            'timestamp' => time() * 1000,
            'ttl' => intval($ttl)
        ];
        
        saveCache($cache);
        echo json_encode(['success' => true, 'cacheSize' => count($cache)]);
        break;
        
    case 'getForceData':
        $forceId = $_GET['forceId'] ?? $_POST['forceId'] ?? null;
        $months = $_GET['months'] ?? $_POST['months'] ?? null;
        
        if (!$forceId || !$months) {
            http_response_code(400);
            echo json_encode(['error' => 'forceId and months are required']);
            exit();
        }
        
        $monthsArray = json_decode($months, true);
        if (!is_array($monthsArray)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid months array']);
            exit();
        }
        
        $cache = loadCache();
        $forceResults = [];
        $cachedCount = 0;
        $missingMonths = [];
        
        foreach ($monthsArray as $month) {
            $key = "aggregated:{$forceId}:{$month}";
            if (isset($cache[$key])) {
                $entry = $cache[$key];
                if (time() * 1000 - $entry['timestamp'] <= $entry['ttl']) {
                    $forceResults[$month] = $entry['data'];
                    $cachedCount++;
                } else {
                    unset($cache[$key]);
                    $missingMonths[] = $month;
                }
            } else {
                $missingMonths[] = $month;
            }
        }
        
        if (!empty($missingMonths)) {
            saveCache($cache);
        }
        
        echo json_encode([
            'forceId' => $forceId,
            'cached' => $forceResults,
            'cachedCount' => $cachedCount,
            'missingMonths' => $missingMonths,
            'totalMonths' => count($monthsArray)
        ]);
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action. Use: get, set, stats, or getForceData']);
        break;
}
?>
