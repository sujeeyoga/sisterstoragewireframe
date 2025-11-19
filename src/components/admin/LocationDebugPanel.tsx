import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocationDetection } from '@/hooks/useLocationDetection';
import { MapPin, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const LOCATION_CACHE_KEY = 'user_location_cache';

const LocationDebugPanel = () => {
  const location = useLocationDetection();

  const clearCache = () => {
    localStorage.removeItem(LOCATION_CACHE_KEY);
    toast.success('Location cache cleared. Refresh the page to re-detect.');
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const getCachedData = () => {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!cached) return null;
    try {
      const parsed = JSON.parse(cached);
      return {
        ...parsed,
        age: Math.round((Date.now() - parsed.timestamp) / 1000 / 60),
      };
    } catch {
      return null;
    }
  };

  const cachedData = getCachedData();
  const sessionId = sessionStorage.getItem('session_id');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Detection Debug
        </CardTitle>
        <CardDescription>
          View and troubleshoot user location detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Session */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Session Info</h3>
          <div className="bg-muted p-3 rounded-md space-y-1 text-sm font-mono">
            <div><strong>Session ID:</strong> {sessionId || 'Not found'}</div>
          </div>
        </div>

        {/* Detected Location */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Detected Location</h3>
          <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
            <div><strong>Loading:</strong> {location.isLoading ? 'Yes' : 'No'}</div>
            <div><strong>City:</strong> {location.city || 'N/A'}</div>
            <div><strong>Region:</strong> {location.region || 'N/A'}</div>
            <div><strong>Country:</strong> {location.country || 'N/A'}</div>
            <div>
              <strong>Is GTA:</strong>{' '}
              <span className={location.isGTA ? 'text-green-600 font-bold' : 'text-red-600'}>
                {location.isGTA ? 'YES ✓' : 'NO'}
              </span>
            </div>
            <div><strong>Shipping Zone:</strong> {location.shippingZone || 'N/A'}</div>
          </div>
        </div>

        {/* Expected Shipping Threshold */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Shipping Thresholds</h3>
          <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
            {location.isGTA ? (
              <div className="text-green-600 font-semibold">
                ✓ GTA: Free shipping over $50
              </div>
            ) : (
              <div>
                Non-GTA: Free shipping over $289
              </div>
            )}
          </div>
        </div>

        {/* Cached Data */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Cached Data</h3>
          {cachedData ? (
            <div className="bg-muted p-3 rounded-md space-y-1 text-sm font-mono">
              <div><strong>Age:</strong> {cachedData.age} minutes</div>
              <div><strong>Cached Location:</strong></div>
              <pre className="text-xs mt-2 overflow-auto">
                {JSON.stringify(cachedData.location, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
              No cached data
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={clearCache}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cache
          </Button>
          <Button
            onClick={refreshPage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md text-sm">
          <strong>Troubleshooting Steps:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Check console logs for detailed location detection flow</li>
            <li>Click "Clear Cache" to force fresh location detection</li>
            <li>Click "Refresh Page" to re-run detection</li>
            <li>Verify visitor_analytics table has correct data for this session</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationDebugPanel;
