import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Address {
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
}

interface ShippingZoneRule {
  id: string;
  zone_id: string;
  rule_type: 'country' | 'province' | 'postal_code_pattern' | 'city';
  rule_value: string;
}

interface ShippingZoneRate {
  id: string;
  zone_id: string;
  method_name: string;
  rate_type: 'flat_rate' | 'free_threshold';
  rate_amount: number;
  free_threshold: number | null;
  enabled: boolean;
  display_order: number;
}

interface ShippingZone {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  enabled: boolean;
  rules: ShippingZoneRule[];
  rates: ShippingZoneRate[];
}

const normalizePostalCode = (postalCode: string): string => {
  return postalCode.toUpperCase().replace(/\s+/g, '');
};

const matchesPostalPattern = (postalCode: string, pattern: string): boolean => {
  const normalized = normalizePostalCode(postalCode);
  const normalizedPattern = normalizePostalCode(pattern);
  const regexPattern = normalizedPattern.replace(/\*/g, '.*');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(normalized);
};

const getRulePriority = (ruleType: string): number => {
  const priorities = {
    postal_code_pattern: 400,
    city: 300,
    province: 200,
    country: 100,
  };
  return priorities[ruleType as keyof typeof priorities] || 0;
};

// GTA zone ID - identifies the zone that should get free shipping over $50
const GTA_ZONE_ID = 'aa000000-0000-0000-0000-000000000001';

const matchesRule = (address: Address, rule: ShippingZoneRule): boolean => {
  const normalizedValue = rule.rule_value.toUpperCase().trim();
  
  switch (rule.rule_type) {
    case 'postal_code_pattern':
      return address.postalCode 
        ? matchesPostalPattern(address.postalCode, rule.rule_value)
        : false;
    case 'city':
      return address.city?.toUpperCase().trim() === normalizedValue;
    case 'province':
      return address.province?.toUpperCase().trim() === normalizedValue;
    case 'country':
      return address.country?.toUpperCase().trim() === normalizedValue;
    default:
      return false;
  }
};

const matchAddressToZone = (
  address: Address, 
  zones: ShippingZone[]
): { zone: ShippingZone; matchedRule: ShippingZoneRule } | null => {
  let bestMatch: { zone: ShippingZone; matchedRule: ShippingZoneRule; priority: number } | null = null;
  
  for (const zone of zones) {
    if (!zone.enabled || !zone.rules || zone.rules.length === 0) {
      continue;
    }
    
    for (const rule of zone.rules) {
      if (matchesRule(address, rule)) {
        const rulePriority = getRulePriority(rule.rule_type);
        const totalPriority = zone.priority + rulePriority;
        
        if (!bestMatch || totalPriority > bestMatch.priority) {
          bestMatch = { zone, matchedRule: rule, priority: totalPriority };
        }
        break;
      }
    }
  }
  
  return bestMatch ? { zone: bestMatch.zone, matchedRule: bestMatch.matchedRule } : null;
};

/**
 * Calls Stallion API to get real-time shipping rates
 */
const getStallionRates = async (address: Address, supabase: any): Promise<any> => {
  try {
    console.log('Fetching Stallion rates for address:', address);
    
    const { data, error } = await supabase.functions.invoke('stallion-express', {
      body: {
        action: 'get-rates',
        data: {
          to_address: {
            name: 'Customer',
            company: '',
            address1: '123 Main St',
            city: address.city || '',
            province_code: address.province || '',
            country_code: address.country || 'US',
            postal_code: address.postalCode || '',
            phone: ''
          },
          weight: 0.5,
          weight_unit: 'kg',
          length: 12,
          width: 10,
          height: 4,
          size_unit: 'cm',
          package_contents: 'Bangle Storage Set',
          value: 50,
          currency: 'USD'
        }
      }
    });

    if (error) {
      console.error('Stallion API error:', error);
      return null;
    }

    console.log('Stallion rates response:', data);
    return data;
  } catch (error) {
    console.error('Error calling Stallion API:', error);
    return null;
  }
};

/**
 * Transforms Stallion rates to our rate format
 * Converts CAD to USD using conservative rate
 */
const transformStallionRates = (stallionData: any, subtotal: number): any[] => {
  // Stallion returns nested structure: { success: true, data: { rates: [...] } }
  const rates = stallionData?.data?.rates || stallionData?.rates;
  const CAD_TO_USD = 0.73; // Conservative conversion rate
  
  if (!rates || !Array.isArray(rates)) {
    console.log('No rates in Stallion response');
    return [];
  }

  console.log(`Converting Stallion rates using CAD→USD rate: ${CAD_TO_USD}`);

  return rates
    .filter((rate: any) => rate.total && rate.postage_type)
    .map((rate: any, index: number) => {
      const cadAmount = parseFloat(rate.total);
      const usdAmount = cadAmount * CAD_TO_USD;
      
      console.log(`Stallion rate: ${rate.postage_type} - $${cadAmount.toFixed(2)} CAD → $${usdAmount.toFixed(2)} USD`);
      
      return {
        id: `stallion_${rate.postage_type_id || index}`,
        method_name: `${rate.postage_type} (from Canada)`,
        rate_amount: parseFloat(usdAmount.toFixed(2)),
        is_free: false,
        free_threshold: null,
        display_order: index + 1,
        currency: 'USD',
        original_cad_amount: cadAmount,
      };
    });
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { address, subtotal } = await req.json();

    console.log('Calculating shipping for address:', address, 'subtotal:', subtotal);

    // Fetch all zones with rules and rates
    const { data: zonesData, error: zonesError } = await supabase
      .from('shipping_zones')
      .select('*')
      .eq('enabled', true)
      .order('priority', { ascending: false });

    if (zonesError) throw zonesError;

    const { data: rulesData, error: rulesError } = await supabase
      .from('shipping_zone_rules')
      .select('*');

    if (rulesError) throw rulesError;

    const { data: ratesData, error: ratesError } = await supabase
      .from('shipping_zone_rates')
      .select('*')
      .eq('enabled', true)
      .order('display_order', { ascending: true });

    if (ratesError) throw ratesError;

    // Combine data
    const zones: ShippingZone[] = zonesData.map(zone => ({
      ...zone,
      rules: rulesData.filter(rule => rule.zone_id === zone.id),
      rates: ratesData.filter(rate => rate.zone_id === zone.id),
    }));

    // Match address to zone
    const matchResult = matchAddressToZone(address, zones);

    if (matchResult) {
      const { zone: matchedZone, matchedRule } = matchResult;
      
      let applicableRates = [];
      let rateSource = 'database';

      // For US zones, try to get real-time Stallion rates
      const isUSZone = address.country?.toUpperCase() === 'US' || 
                       matchedRule.rule_value?.toUpperCase() === 'US';

      if (isUSZone) {
        console.log('US zone detected, fetching Stallion rates...');
        const stallionData = await getStallionRates(address, supabase);
        
        if (stallionData) {
          applicableRates = transformStallionRates(stallionData, subtotal);
          rateSource = 'stallion';
          console.log('Using Stallion rates:', applicableRates);
        }
      }

      // Fall back to appropriate rates if Stallion failed
      if (applicableRates.length === 0) {
        if (isUSZone) {
          // US fallback: Higher safety rate if Stallion completely fails
          console.log('⚠️ Stallion API failed - using US safety fallback: $35');
          applicableRates = [{
            id: 'us_safety_fallback',
            method_name: 'Standard Shipping (Estimated)',
            rate_amount: 35,
            is_free: false,
            free_threshold: null,
            display_order: 0,
          }];
          rateSource = 'us_safety_fallback';
        } else {
          // Non-US: use database rates
          console.log('Using database rates for non-US zone');
          
          // Check if this is the GTA zone and free shipping applies
          const isGTAZone = matchedZone.id === GTA_ZONE_ID;
          const gtaFreeShipping = isGTAZone && subtotal >= 75;
          
          if (gtaFreeShipping) {
            console.log('🎉 GTA Free Shipping unlocked! (subtotal >= $75, matched to GTA zone)');
          }
          
          applicableRates = matchedZone.rates.map(rate => {
            // Check database free threshold first
            const meetsDatabaseThreshold = 
              rate.free_threshold !== null && 
              subtotal >= rate.free_threshold;
            
            // Apply GTA free shipping or database threshold
            const isFree = gtaFreeShipping || meetsDatabaseThreshold;
            
            return {
              id: rate.id,
              method_name: rate.method_name,
              rate_amount: isFree ? 0 : rate.rate_amount,
              is_free: isFree,
              free_threshold: rate.free_threshold,
              display_order: rate.display_order,
              gta_free_shipping_applied: gtaFreeShipping,
            };
          });
          rateSource = gtaFreeShipping ? 'gta_free_shipping' : 'database';
        }
      }

      console.log('Matched zone:', matchedZone.name, 'rates:', applicableRates, 'source:', rateSource);

      return new Response(
        JSON.stringify({
          success: true,
          zone: {
            id: matchedZone.id,
            name: matchedZone.name,
            description: matchedZone.description,
          },
          matchedRule: {
            rule_type: matchedRule.rule_type,
            rule_value: matchedRule.rule_value,
          },
          rates: applicableRates,
          appliedRate: applicableRates[0] || null,
          fallback_used: false,
          rate_source: rateSource,
          source: rateSource,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No zone matched, use fallback
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('shipping_fallback_settings')
      .select('*')
      .eq('enabled', true)
      .limit(1)
      .single();

    if (fallbackError && fallbackError.code !== 'PGRST116') throw fallbackError;

    const fallbackRate = fallbackData?.fallback_rate || 9.99;
    const fallbackMethodName = fallbackData?.fallback_method_name || 'Standard Shipping';

    console.log('No zone matched, using fallback:', fallbackRate);

    return new Response(
      JSON.stringify({
        success: true,
        zone: null,
        matchedRule: null,
        rates: [
          {
            id: 'fallback',
            method_name: fallbackMethodName,
            rate_amount: fallbackRate,
            is_free: false,
            display_order: 0,
          },
        ],
        appliedRate: {
          id: 'fallback',
          method_name: fallbackMethodName,
          rate_amount: fallbackRate,
          is_free: false,
          display_order: 0,
        },
        fallback_used: true,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
