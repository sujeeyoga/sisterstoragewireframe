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

  // Validate Canadian postal code or US ZIP code
  const validatePostalCode = (postalCode: string, country: string = 'CA'): { valid: boolean; formatted: string; error?: string } => {
    if (!postalCode) {
      return { valid: false, formatted: '', error: 'Postal/ZIP code is required' };
    }

    const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
    
    if (country === 'CA' || country === 'Canada') {
      const canadianPattern = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;
      if (!canadianPattern.test(cleaned)) {
        return { 
          valid: false, 
          formatted: cleaned,
          error: 'Invalid Canadian postal code (e.g., M5V3A8)'
        };
      }
    } else if (country === 'US' || country === 'USA' || country === 'United States') {
      const usPattern = /^\d{5}(-?\d{4})?$/;
      const zipCleaned = cleaned.replace(/-/g, '');
      if (!usPattern.test(zipCleaned)) {
        return { 
          valid: false, 
          formatted: cleaned,
          error: 'Invalid US ZIP code (e.g., 12345)'
        };
      }
    } else {
      return { 
        valid: false, 
        formatted: cleaned,
        error: 'Only CA and US addresses supported'
      };
    }

    return { valid: true, formatted: cleaned };
  };

  const getRates = async (request: RateRequest) => {
    setLoading(true);
    try {
      // Validate postal codes based on country
      const fromCountry = request.from.country || 'CA';
      const toCountry = request.to.country || 'CA';
      
      const fromPostalValidation = validatePostalCode(request.from.postal_code, fromCountry);
      if (!fromPostalValidation.valid) {
        throw new Error(`From address: ${fromPostalValidation.error}`);
      }
      
      const toPostalValidation = validatePostalCode(request.to.postal_code, toCountry);
      if (!toPostalValidation.valid) {
        throw new Error(`To address: ${toPostalValidation.error}`);
      }
      
      // Format the request for Stallion API v4
      const formattedRequest = {
        from_address: {
          name: request.from.name || '',
          address1: request.from.street1 || '',
          city: request.from.city || '',
          province_code: request.from.province || '',
          postal_code: fromPostalValidation.formatted,
          country_code: request.from.country || 'CA',
        },
        to_address: {
          name: request.to.name || '',
          address1: request.to.street1 || '',
          city: request.to.city || '',
          province_code: request.to.province || '',
          postal_code: toPostalValidation.formatted,
          country_code: request.to.country || 'CA',
          phone: request.to.phone || '',
          email: request.to.email || '',
        },
        weight: request.packages[0]?.weight || 1,
        weight_unit: request.packages[0]?.units === 'metric' ? 'kg' : 'lb',
        length: request.packages[0]?.length || 30,
        width: request.packages[0]?.width || 20,
        height: request.packages[0]?.height || 10,
        size_unit: request.packages[0]?.units === 'metric' ? 'cm' : 'in',
        package_contents: 'Jewelry storage accessories',
        value: 100,
        currency: 'CAD',
      };

      console.log('Formatted get-rates request:', formattedRequest);

      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'get-rates',
          data: formattedRequest,
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
      // Validate postal codes based on country
      const fromCountry = request.from.country || 'CA';
      const toCountry = request.to.country || 'CA';
      
      const fromPostalValidation = validatePostalCode(request.from.postal_code, fromCountry);
      if (!fromPostalValidation.valid) {
        throw new Error(`From address: ${fromPostalValidation.error}`);
      }
      
      const toPostalValidation = validatePostalCode(request.to.postal_code, toCountry);
      if (!toPostalValidation.valid) {
        throw new Error(`To address: ${toPostalValidation.error}`);
      }
      
      // Format the request for Stallion API v4
      const formattedRequest = {
        from_address: {
          name: request.from.name || '',
          address1: request.from.street1 || '',
          city: request.from.city || '',
          province_code: request.from.province || '',
          postal_code: fromPostalValidation.formatted,
          country_code: request.from.country || 'CA',
        },
        to_address: {
          name: request.to.name || '',
          address1: request.to.street1 || '',
          city: request.to.city || '',
          province_code: request.to.province || '',
          postal_code: toPostalValidation.formatted,
          country_code: request.to.country || 'CA',
          phone: request.to.phone || '',
          email: request.to.email || '',
        },
        weight: request.packages[0]?.weight || 1,
        weight_unit: request.packages[0]?.units === 'metric' ? 'kg' : 'lb',
        length: request.packages[0]?.length || 30,
        width: request.packages[0]?.width || 20,
        height: request.packages[0]?.height || 10,
        size_unit: request.packages[0]?.units === 'metric' ? 'cm' : 'in',
        package_contents: 'Jewelry storage accessories',
        value: 100,
        currency: 'CAD',
        postage_type: request.postage_type || 'DOM.EP',
        reference: request.reference || '',
      };

      console.log('Formatted create-shipment request:', formattedRequest);

      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'create-shipment',
          data: formattedRequest,
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
