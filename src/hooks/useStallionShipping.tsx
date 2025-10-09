import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ShippingAddress {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  phone?: string;
  email?: string;
}

interface Package {
  weight: number;
  length: number;
  width: number;
  height: number;
  units?: 'imperial' | 'metric';
}

interface RateRequest {
  from: ShippingAddress;
  to: ShippingAddress;
  packages: Package[];
}

interface ShipmentRequest extends RateRequest {
  postage_type: string;
  reference?: string;
}

export const useStallionShipping = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getRates = async (request: RateRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'get-rates',
          data: request,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to get rates');
      }

      return data.data;
    } catch (error: any) {
      console.error('Error getting rates:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get shipping rates',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async (request: ShipmentRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'create-shipment',
          data: request,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to create shipment');
      }

      toast({
        title: 'Success',
        description: 'Shipment created successfully',
      });

      return data.data;
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create shipment',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getShipment = async (shipmentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'get-shipment',
          data: { shipmentId },
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to get shipment');
      }

      return data.data;
    } catch (error: any) {
      console.error('Error getting shipment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get shipment details',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLabel = async (shipmentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'get-label',
          data: { shipmentId },
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to get label');
      }

      return data.data;
    } catch (error: any) {
      console.error('Error getting label:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get shipping label',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelShipment = async (shipmentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'cancel-shipment',
          data: { shipmentId },
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to cancel shipment');
      }

      toast({
        title: 'Success',
        description: 'Shipment cancelled successfully',
      });

      return data.data;
    } catch (error: any) {
      console.error('Error cancelling shipment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel shipment',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTracking = async (shipmentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'get-tracking',
          data: { shipmentId },
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to get tracking');
      }

      return data.data;
    } catch (error: any) {
      console.error('Error getting tracking:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get tracking information',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPostageTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'get-postage-types',
          data: {},
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to get postage types');
      }

      return data.data;
    } catch (error: any) {
      console.error('Error getting postage types:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get postage types',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getRates,
    createShipment,
    getShipment,
    getLabel,
    cancelShipment,
    getTracking,
    getPostageTypes,
  };
};
