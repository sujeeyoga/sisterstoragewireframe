import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChitChatsRateRequest {
  to_country: string;
  to_state?: string;
  to_city?: string;
  to_postal_code: string;
  weight: number; // in grams
  length?: number; // in cm
  width?: number; // in cm
  height?: number; // in cm
  package_value?: number; // for customs
}

interface ChitChatsShipmentRequest extends ChitChatsRateRequest {
  to_name: string;
  to_address_1: string;
  to_address_2?: string;
  to_phone?: string;
  carrier?: string;
  service_code?: string;
  order_id?: string;
  description?: string;
}

const CHITCHATS_API_BASE = "https://chitchats.com/api/v1";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('CHITCHATS_CLIENT_ID');
    const apiToken = Deno.env.get('CHITCHATS_API_TOKEN');

    if (!clientId || !apiToken) {
      console.error('ChitChats credentials not configured');
      return new Response(
        JSON.stringify({ 
          error: 'ChitChats credentials not configured. Please add CHITCHATS_CLIENT_ID and CHITCHATS_API_TOKEN secrets.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { action, ...params } = await req.json();
    console.log('ChitChats request:', { action, params });

    const authHeader = `Basic ${btoa(`${clientId}:${apiToken}`)}`;

    switch (action) {
      case 'get_rates': {
        const rateParams = params as ChitChatsRateRequest;
        
        // Build query parameters for rate quote
        const queryParams = new URLSearchParams({
          to_country: rateParams.to_country,
          to_postal_code: rateParams.to_postal_code,
          weight: rateParams.weight.toString(),
        });

        if (rateParams.to_state) queryParams.append('to_state', rateParams.to_state);
        if (rateParams.to_city) queryParams.append('to_city', rateParams.to_city);
        if (rateParams.length) queryParams.append('length', rateParams.length.toString());
        if (rateParams.width) queryParams.append('width', rateParams.width.toString());
        if (rateParams.height) queryParams.append('height', rateParams.height.toString());

        const rateResponse = await fetch(
          `${CHITCHATS_API_BASE}/rates?${queryParams.toString()}`,
          {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
          }
        );

        const rateData = await rateResponse.json();
        console.log('ChitChats rates response:', rateData);

        if (!rateResponse.ok) {
          throw new Error(`ChitChats API error: ${JSON.stringify(rateData)}`);
        }

        return new Response(
          JSON.stringify({ success: true, data: rateData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create_shipment': {
        const shipmentParams = params as ChitChatsShipmentRequest;
        
        // Create shipment payload
        const shipmentPayload = {
          name: shipmentParams.to_name,
          address_1: shipmentParams.to_address_1,
          address_2: shipmentParams.to_address_2 || '',
          city: shipmentParams.to_city || '',
          province_code: shipmentParams.to_state || '',
          postal_code: shipmentParams.to_postal_code,
          country_code: shipmentParams.to_country,
          phone: shipmentParams.to_phone || '',
          package_contents: 'merchandise',
          description: shipmentParams.description || 'Jewelry organizer',
          value: shipmentParams.package_value || 50,
          value_currency: 'USD',
          order_id: shipmentParams.order_id || '',
          weight: shipmentParams.weight,
          size_unit: 'cm',
          size_x: shipmentParams.length || 25,
          size_y: shipmentParams.width || 20,
          size_z: shipmentParams.height || 10,
          carrier: shipmentParams.carrier || 'usps',
          service_code: shipmentParams.service_code || 'usps_priority_mail',
        };

        const shipmentResponse = await fetch(
          `${CHITCHATS_API_BASE}/shipments`,
          {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(shipmentPayload),
          }
        );

        const shipmentData = await shipmentResponse.json();
        console.log('ChitChats shipment response:', shipmentData);

        if (!shipmentResponse.ok) {
          throw new Error(`ChitChats API error: ${JSON.stringify(shipmentData)}`);
        }

        return new Response(
          JSON.stringify({ success: true, data: shipmentData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_shipment': {
        const { shipment_id } = params;
        
        const shipmentResponse = await fetch(
          `${CHITCHATS_API_BASE}/shipments/${shipment_id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
          }
        );

        const shipmentData = await shipmentResponse.json();

        if (!shipmentResponse.ok) {
          throw new Error(`ChitChats API error: ${JSON.stringify(shipmentData)}`);
        }

        return new Response(
          JSON.stringify({ success: true, data: shipmentData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'void_shipment': {
        const { shipment_id } = params;
        
        const voidResponse = await fetch(
          `${CHITCHATS_API_BASE}/shipments/${shipment_id}/void`,
          {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
          }
        );

        const voidData = await voidResponse.json();

        if (!voidResponse.ok) {
          throw new Error(`ChitChats API error: ${JSON.stringify(voidData)}`);
        }

        return new Response(
          JSON.stringify({ success: true, data: voidData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('ChitChats function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
