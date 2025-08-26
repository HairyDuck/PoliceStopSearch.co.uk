# PHP API for PoliceStopSearch.co.uk

This directory contains PHP API endpoints that provide server-side functionality for the PoliceStopSearch.co.uk website.

## Setup Instructions

1. **Upload these files** to your hosting provider in a directory that will be accessible via `api.policestopsearch.co.uk`
2. **Create a subdomain** `api.policestopsearch.co.uk` and point it to this directory
3. **Ensure the `data` folder** (one level up) is writable by the PHP scripts
4. **Test the endpoints** to ensure they're working correctly

## API Endpoints

### 1. Cache Management (`cache.php`)

Handles server-side caching functionality.

**Actions:**
- `stats` - Get cache statistics
- `get` - Retrieve cached data
- `set` - Store data in cache
- `getForceData` - Get cached force data for specific months

**Example usage:**
```
GET /cache.php?action=stats
POST /cache.php (action=set&key=test&data={"test":true})
```

### 2. Force Data (`force-data.php`)

Fetches and processes police force data from the UK Police API.

**Parameters:**
- `force` (required) - Force ID (e.g., 'avon-and-somerset')
- `date` (optional) - Date in YYYY-MM format

**Example usage:**
```
GET /force-data.php?force=avon-and-somerset&date=2024-12
```

### 3. Transparency Analysis (`transparency-analysis.php`)

Analyzes cache data to identify forces with transparency issues.

**Example usage:**
```
GET /transparency-analysis.php
```

## CORS Support

All endpoints include CORS headers to allow cross-origin requests from the main website.

## Error Handling

All endpoints return appropriate HTTP status codes and JSON error messages for invalid requests.

## Caching

- Data is cached in `../data/server-cache.json`
- Cache entries have a 90-day TTL by default
- Expired entries are automatically cleaned up

## Security

- Input validation is performed on all parameters
- JSON responses are properly encoded
- CORS is configured for the main domain only

## Testing

Test the endpoints by visiting:
- `https://api.policestopsearch.co.uk/cache.php?action=stats`
- `https://api.policestopsearch.co.uk/force-data.php?force=avon-and-somerset`
- `https://api.policestopsearch.co.uk/transparency-analysis.php`
