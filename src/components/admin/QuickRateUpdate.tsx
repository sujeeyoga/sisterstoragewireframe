import { useEffect } from 'react';
import { useShippingZones } from '@/hooks/useShippingZones';
import { toast } from 'sonner';

export const QuickRateUpdate = () => {
  const { updateRate } = useShippingZones();

  useEffect(() => {
    // Update Standard Shipping rate to $30
    updateRate({
      id: 'b17afd58-cb69-4736-b24b-5af2cd025dd7',
      rate_amount: 30.00
    });
    toast.success('Updated Standard Shipping to $30');
  }, [updateRate]);

  return null;
};
