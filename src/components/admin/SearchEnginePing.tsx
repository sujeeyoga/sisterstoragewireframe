import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SearchEnginePing = () => {
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingResults, setLastPingResults] = useState<any>(null);

  const handlePing = async () => {
    setIsPinging(true);
    try {
      const { data, error } = await supabase.functions.invoke('ping-search-engines', {
        body: {}
      });

      if (error) throw error;

      if (data?.success) {
        setLastPingResults(data.results);
        toast.success('Search engines notified successfully!');
      } else {
        toast.error('Failed to notify search engines');
      }
    } catch (error: any) {
      console.error('Error pinging search engines:', error);
      toast.error(`Failed to ping search engines: ${error.message}`);
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Search Engine Indexing
        </CardTitle>
        <CardDescription>
          Notify Google and Bing about your sitemap updates to speed up crawling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This pings Google and Bing to notify them about sitemap changes. For best results, also submit your sitemap in Google Search Console.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handlePing} 
          disabled={isPinging}
          className="w-full"
        >
          {isPinging ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Pinging Search Engines...
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 mr-2" />
              Ping Google & Bing Now
            </>
          )}
        </Button>

        {lastPingResults && (
          <div className="space-y-3 mt-4">
            <h4 className="font-semibold text-sm">Last Ping Results:</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {lastPingResults.google.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">Google</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {lastPingResults.google.message}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {lastPingResults.bing.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">Bing</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {lastPingResults.bing.message}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Last pinged: {new Date(lastPingResults.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-semibold text-sm mb-2">Next Steps:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Connect your custom domain (sisterstorage.com)</li>
            <li>Submit sitemap in Google Search Console</li>
            <li>Use "Request Indexing" for important pages</li>
            <li>Monitor "Coverage" report after 2-3 days</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};