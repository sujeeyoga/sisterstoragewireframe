import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, DollarSign } from 'lucide-react';
import { useShippingThresholds } from '@/hooks/useShippingThresholds';

export function ShippingThresholdsDisplay() {
  const { data, isLoading, error } = useShippingThresholds();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-destructive">Failed to load shipping thresholds</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Active Free Shipping Thresholds
        </CardTitle>
        <CardDescription>
          Current free shipping thresholds by region
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.thresholds && data.thresholds.length > 0 ? (
          data.thresholds.map((threshold, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {threshold.zone_name}
                  </h3>
                  {threshold.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {threshold.description}
                    </p>
                  )}
                </div>
                <Badge variant="secondary">Priority {threshold.priority}</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Coverage:</p>
                <div className="flex flex-wrap gap-2">
                  {threshold.rules.map((rule, rIdx) => (
                    <Badge key={rIdx} variant="outline">
                      {rule.type}: {rule.value}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Free Shipping Thresholds:</p>
                {threshold.free_shipping_thresholds.map((rate, rIdx) => (
                  <div key={rIdx} className="flex items-center justify-between bg-muted/50 rounded p-3">
                    <span className="text-sm font-medium">{rate.method}</span>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Free over ${rate.threshold.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No free shipping thresholds configured</p>
        )}

        {data?.fallback && data.fallback.enabled && (
          <div className="border-t pt-4 mt-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Fallback Shipping (Other Regions)</h4>
              <p className="text-sm">
                {data.fallback.method}: ${data.fallback.rate.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
