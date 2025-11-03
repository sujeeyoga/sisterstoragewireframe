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

const getApiUrl = (clientId: string, path: string) => {
  return `${CHITCHATS_API_BASE}/clients/${clientId}${path}`;
};

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

    const authHeader = `${apiToken}`;

    switch (action) {
      case 'get_rates': {
        const rateParams = params as ChitChatsRateRequest;
        
        // Create a draft shipment to get rates
        const shipmentPayload = {
          name: "Rate Quote",
          address_1: "123 Street",
          city: rateParams.to_city || "",
          province_code: rateParams.to_state || "",
          postal_code: rateParams.to_postal_code,
          country_code: rateParams.to_country,
          package_contents: "merchandise",
          value: rateParams.package_value || 50,
          value_currency: "USD",
          postage_type: "unknown",
          package_type: "parcel",
          size_unit: "cm",
          size_x: rateParams.length || 25,
          size_y: rateParams.width || 20,
          size_z: rateParams.height || 10,
          weight_unit: "g",
          weight: rateParams.weight,
          line_items: [{
            quantity: 1,
            description: "Jewelry organizer",
            value_amount: (rateParams.package_value || 50).toString(),
            currency_code: "usd",
            origin_country: "CA",
            weight: rateParams.weight,
            weight_unit: "g"
          }],
        };

        const rateResponse = await fetch(
          getApiUrl(clientId, '/shipments'),
          {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(shipmentPayload),
          }
        );

        console.log('ChitChats API response status:', rateResponse.status);
        const responseText = await rateResponse.text();
        console.log('ChitChats API raw response:', responseText.substring(0, 500));

        if (!rateResponse.ok) {
          throw new Error(`ChitChats API error (${rateResponse.status}): ${responseText.substring(0, 200)}`);
        }

        let rateData;
        try {
          rateData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Invalid JSON response from ChitChats: ${responseText.substring(0, 200)}`);
        }
        
        console.log('ChitChats rates response:', rateData);

        // Delete the draft shipment
        if (rateData.id) {
          await fetch(
            getApiUrl(clientId, `/shipments/${rateData.id}`),
            {
              method: 'DELETE',
              headers: {
                'Authorization': authHeader,
              },
            }
          );
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
          weight_unit: 'g',
          weight: shipmentParams.weight,
          size_unit: 'cm',
          size_x: shipmentParams.length || 25,
          size_y: shipmentParams.width || 20,
          size_z: shipmentParams.height || 10,
          postage_type: shipmentParams.service_code || 'usps_priority',
        };

        const shipmentResponse = await fetch(
          getApiUrl(clientId, '/shipments'),
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
          getApiUrl(clientId, `/shipments/${shipment_id}`),
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
          getApiUrl(clientId, `/shipments/${shipment_id}`),
          {
            method: 'DELETE',
            headers: {
              'Authorization': authHeader,
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
