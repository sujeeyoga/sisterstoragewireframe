import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface PackageDimensions {
  weight: number; // in grams
  length?: number; // in cm
  width?: number; // in cm
  height?: number; // in cm
  packageValue?: number; // for customs
}

interface RateRequest extends PackageDimensions {
  to_country: string;
  to_state?: string;
  to_city?: string;
  to_postal_code: string;
}

interface ShipmentRequest extends RateRequest {
  to_name: string;
  to_address_1: string;
  to_address_2?: string;
  to_phone?: string;
  carrier?: string;
  service_code?: string;
  order_id?: string;
  description?: string;
}

export const useChitChatsShipping = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getRates = async (address: ShippingAddress, packageInfo: PackageDimensions) => {
    setIsLoading(true);
    try {
      console.log('Getting ChitChats rates:', { address, packageInfo });

      const { data, error } = await supabase.functions.invoke('chitchats-shipping', {
        body: {
          action: 'get_rates',
          to_country: address.country,
          to_state: address.state,
          to_city: address.city,
          to_postal_code: address.postalCode,
          weight: packageInfo.weight,
          length: packageInfo.length,
          width: packageInfo.width,
          height: packageInfo.height,
          package_value: packageInfo.packageValue,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to get rates');

      console.log('ChitChats rates:', data.data);
      return data.data;
    } catch (error: any) {
      console.error('Error getting ChitChats rates:', error);
      toast.error(`Failed to get shipping rates: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createShipment = async (
    address: ShippingAddress,
    packageInfo: PackageDimensions,
    options?: {
      carrier?: string;
      serviceCode?: string;
      orderId?: string;
      description?: string;
    }
  ) => {
    setIsLoading(true);
    try {
      console.log('Creating ChitChats shipment:', { address, packageInfo, options });

      const { data, error } = await supabase.functions.invoke('chitchats-shipping', {
        body: {
          action: 'create_shipment',
          to_name: address.name,
          to_address_1: address.address1,
          to_address_2: address.address2,
          to_city: address.city,
          to_state: address.state,
          to_postal_code: address.postalCode,
          to_country: address.country,
          to_phone: address.phone,
          weight: packageInfo.weight,
          length: packageInfo.length,
          width: packageInfo.width,
          height: packageInfo.height,
          package_value: packageInfo.packageValue,
          carrier: options?.carrier,
          service_code: options?.serviceCode,
          order_id: options?.orderId,
          description: options?.description,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to create shipment');

      console.log('ChitChats shipment created:', data.data);
      toast.success('Shipping label created successfully');
      return data.data;
    } catch (error: any) {
      console.error('Error creating ChitChats shipment:', error);
      toast.error(`Failed to create shipment: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getShipment = async (shipmentId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('chitchats-shipping', {
        body: {
          action: 'get_shipment',
          shipment_id: shipmentId,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to get shipment');

      return data.data;
    } catch (error: any) {
      console.error('Error getting ChitChats shipment:', error);
      toast.error(`Failed to get shipment: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const voidShipment = async (shipmentId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('chitchats-shipping', {
        body: {
          action: 'void_shipment',
          shipment_id: shipmentId,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to void shipment');

      toast.success('Shipment voided successfully');
      return data.data;
    } catch (error: any) {
      console.error('Error voiding ChitChats shipment:', error);
      toast.error(`Failed to void shipment: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getRates,
    createShipment,
    getShipment,
    voidShipment,
  };
};
