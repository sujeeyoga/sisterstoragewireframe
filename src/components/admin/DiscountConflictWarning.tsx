import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DiscountConflictWarningProps {
  storeWideEnabled?: boolean;
  storeWidePercentage?: number;
  activeFlashSalesCount?: number;
  variant?: 'warning' | 'info';
  showActions?: boolean;
}

export const DiscountConflictWarning = ({
  storeWideEnabled,
  storeWidePercentage,
  activeFlashSalesCount,
  variant = 'warning',
  showActions = true,
}: DiscountConflictWarningProps) => {
  const navigate = useNavigate();

  // Show warning when both store-wide and flash sales are active
  const showConflictWarning = storeWideEnabled && activeFlashSalesCount && activeFlashSalesCount > 0;

  // Show info when only one type is active
  const showInfoOnly = (storeWideEnabled && !activeFlashSalesCount) || 
                        (!storeWideEnabled && activeFlashSalesCount && activeFlashSalesCount > 0);

  if (!showConflictWarning && !showInfoOnly) {
    return null;
  }

  return (
    <Alert variant={showConflictWarning ? 'default' : 'default'} className={showConflictWarning ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'}>
      <div className="flex items-start gap-3">
        {showConflictWarning ? (
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
        ) : (
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        )}
        <div className="flex-1">
          <AlertTitle className={showConflictWarning ? 'text-yellow-900' : 'text-blue-900'}>
            {showConflictWarning ? 'Multiple Discount Types Active' : 'Active Promotion'}
          </AlertTitle>
          <AlertDescription className={showConflictWarning ? 'text-yellow-800' : 'text-blue-800'}>
            {showConflictWarning ? (
              <div className="space-y-2">
                <p>
                  You have {activeFlashSalesCount} active flash sale{activeFlashSalesCount !== 1 ? 's' : ''} and a {storeWidePercentage}% store-wide discount running simultaneously.
                </p>
                <div className="text-sm space-y-1 mt-2">
                  <p className="font-semibold">Discount Priority (How they stack):</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li><strong>Flash Sales</strong> - Highest priority, overrides all other discounts</li>
                    <li><strong>Product Sale Prices</strong> - Applied to specific products</li>
                    <li><strong>Store-Wide Discount</strong> - Only applies to full-price items (not already on sale)</li>
                  </ol>
                </div>
                <p className="text-sm mt-2">
                  <strong>Note:</strong> Store-wide discounts will NOT stack with flash sales or existing sale prices.
                </p>
              </div>
            ) : storeWideEnabled ? (
              <p>
                A {storeWidePercentage}% store-wide discount is active. It will only apply to products at full price.
              </p>
            ) : (
              <p>
                {activeFlashSalesCount} flash sale{activeFlashSalesCount !== 1 ? 's are' : ' is'} currently active and will take priority over all other discounts.
              </p>
            )}
          </AlertDescription>
          {showActions && (
            <div className="flex gap-2 mt-3">
              {storeWideEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/settings')}
                  className="text-xs"
                >
                  Manage Store-Wide Discount
                </Button>
              )}
              {activeFlashSalesCount && activeFlashSalesCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/flash-sales')}
                  className="text-xs"
                >
                  Manage Flash Sales
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};