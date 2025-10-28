import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const STALLION_API_TOKEN = Deno.env.get('STALLION_EXPRESS_API_TOKEN');
const STALLION_BASE_URL = 'https://ship.stallionexpress.ca/api/v4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Helper function to format Canadian postal codes and US ZIP codes
  const formatPostalCode = (postalCode: string, country: string = 'CA'): string => {
    if (!postalCode) return '';
    
    // Remove all spaces and convert to uppercase
    const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
    
    // Canadian postal codes should be 6 characters (A1A1A1)
    if (country === 'CA' || country === 'Canada') {
      if (cleaned.length !== 6) {
        console.warn(`Invalid Canadian postal code length: ${postalCode} -> ${cleaned}`);
      }
      return cleaned;
    }
    
    // US ZIP codes should be 5 or 9 characters (12345 or 12345-6789)
    if (country === 'US' || country === 'USA' || country === 'United States') {
      // Remove any hyphens for consistency
      const zipCleaned = cleaned.replace(/-/g, '');
      if (zipCleaned.length !== 5 && zipCleaned.length !== 9) {
        console.warn(`Invalid US ZIP code length: ${postalCode} -> ${zipCleaned}`);
      }
      return zipCleaned;
    }
    
    return cleaned;
  };

  // Helper function to format address data for Stallion API
  const formatAddressForStallion = (address: any) => {
    if (!address) return address;
    
    const country = address.country || 'CA';
    
    return {
      ...address,
      postal_code: address.postal_code ? formatPostalCode(address.postal_code, country) : '',
      province_code: address.province_code || address.province || address.state || '',
      address1: address.address1 || address.street || address.address || '',
      country: country,
    };
  };

  try {
    const { action, data } = await req.json();

    if (!STALLION_API_TOKEN) {
      throw new Error('Stallion Express API token not configured');
    }

    // Format addresses if present in the data
    let formattedData = { ...data };
    if (data.from_address) {
      formattedData.from_address = formatAddressForStallion(data.from_address);
    }
    if (data.to_address) {
      formattedData.to_address = formatAddressForStallion(data.to_address);
    }

    console.log('Stallion Express request:', { 
      action, 
      originalData: data,
      formattedData 
    });

    let endpoint = '';
    let method = 'GET';
    let body = null;

    // Handle different actions
    switch (action) {
      case 'get-rates':
        endpoint = '/rates';
        method = 'POST';
        body = JSON.stringify(formattedData);
        break;

      case 'create-shipment':
        endpoint = '/shipments';
        method = 'POST';
        body = JSON.stringify(formattedData);
        break;

      case 'get-shipment':
        endpoint = `/shipments/${data.shipmentId}`;
        method = 'GET';
        break;

      case 'get-label':
        endpoint = `/shipments/${data.shipmentId}/label`;
        method = 'GET';
        break;

      case 'cancel-shipment':
        endpoint = `/shipments/${data.shipmentId}`;
        method = 'DELETE';
        break;

      case 'get-tracking':
        endpoint = `/shipments/${data.shipmentId}/tracking`;
        method = 'GET';
        break;

      case 'get-postage-types':
        endpoint = '/postage-types';
        method = 'GET';
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Make request to Stallion Express API
    const response = await fetch(`${STALLION_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${STALLION_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body,
    });

    const responseData = await response.json();
    const requestId = response.headers.get('Request-Id');

    console.log('Stallion Express response:', {
      status: response.status,
      requestId,
      success: response.ok,
    });

    if (!response.ok) {
      console.error('Stallion Express API error:', responseData);
      return new Response(
        JSON.stringify({
          error: responseData.message || 'Stallion Express API error',
          details: responseData,
          requestId,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: responseData,
        requestId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in stallion-express function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
