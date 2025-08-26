<?php
// Simple test script to verify PHP API structure

echo "PHP API Test Script\n";
echo "==================\n\n";

// Test 1: Check if cache.php exists and has correct structure
echo "Test 1: Checking cache.php...\n";
if (file_exists('cache.php')) {
    echo "✅ cache.php exists\n";
    
    // Check for required functions
    $content = file_get_contents('cache.php');
    if (strpos($content, 'function loadCache()') !== false) {
        echo "✅ loadCache function found\n";
    } else {
        echo "❌ loadCache function missing\n";
    }
    
    if (strpos($content, 'function saveCache(') !== false) {
        echo "✅ saveCache function found\n";
    } else {
        echo "❌ saveCache function missing\n";
    }
    
    if (strpos($content, 'header(\'Content-Type: application/json\')') !== false) {
        echo "✅ JSON header found\n";
    } else {
        echo "❌ JSON header missing\n";
    }
    
    if (strpos($content, 'Access-Control-Allow-Origin: *') !== false) {
        echo "✅ CORS headers found\n";
    } else {
        echo "❌ CORS headers missing\n";
    }
} else {
    echo "❌ cache.php not found\n";
}

echo "\n";

// Test 2: Check if force-data.php exists and has correct structure
echo "Test 2: Checking force-data.php...\n";
if (file_exists('force-data.php')) {
    echo "✅ force-data.php exists\n";
    
    $content = file_get_contents('force-data.php');
    if (strpos($content, '$force = $_GET[\'force\']') !== false) {
        echo "✅ Force parameter handling found\n";
    } else {
        echo "❌ Force parameter handling missing\n";
    }
    
    if (strpos($content, 'https://data.police.uk/api/stops-force') !== false) {
        echo "✅ External API URL found\n";
    } else {
        echo "❌ External API URL missing\n";
    }
} else {
    echo "❌ force-data.php not found\n";
}

echo "\n";

// Test 3: Check if transparency-analysis.php exists and has correct structure
echo "Test 3: Checking transparency-analysis.php...\n";
if (file_exists('transparency-analysis.php')) {
    echo "✅ transparency-analysis.php exists\n";
    
    $content = file_get_contents('transparency-analysis.php');
    if (strpos($content, '$cacheFile = \'../data/server-cache.json\'') !== false) {
        echo "✅ Cache file path found\n";
    } else {
        echo "❌ Cache file path missing\n";
    }
    
    if (strpos($content, 'forcesWithIssues') !== false) {
        echo "✅ Forces with issues analysis found\n";
    } else {
        echo "❌ Forces with issues analysis missing\n";
    }
} else {
    echo "❌ transparency-analysis.php not found\n";
}

echo "\n";

// Test 4: Check if data directory exists and is writable
echo "Test 4: Checking data directory...\n";
if (file_exists('../data')) {
    echo "✅ data directory exists\n";
    
    if (is_writable('../data')) {
        echo "✅ data directory is writable\n";
    } else {
        echo "❌ data directory is not writable\n";
    }
    
    if (file_exists('../data/server-cache.json')) {
        echo "✅ server-cache.json exists\n";
    } else {
        echo "⚠️ server-cache.json does not exist (will be created when needed)\n";
    }
} else {
    echo "❌ data directory not found\n";
}

echo "\n";
echo "Test completed!\n";
?>
