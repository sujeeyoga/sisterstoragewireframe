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

const matchAddressToZone = (address: Address, zones: ShippingZone[]): ShippingZone | null => {
  let bestMatch: { zone: ShippingZone; priority: number } | null = null;
  
  for (const zone of zones) {
    if (!zone.enabled || !zone.rules || zone.rules.length === 0) {
      continue;
    }
    
    for (const rule of zone.rules) {
      if (matchesRule(address, rule)) {
        const rulePriority = getRulePriority(rule.rule_type);
        const totalPriority = zone.priority + rulePriority;
        
        if (!bestMatch || totalPriority > bestMatch.priority) {
          bestMatch = { zone, priority: totalPriority };
        }
        break;
      }
    }
  }
  
  return bestMatch?.zone || null;
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
    const matchedZone = matchAddressToZone(address, zones);

    if (matchedZone) {
      // Calculate applicable rates
      const applicableRates = matchedZone.rates.map(rate => {
        // Check if free shipping threshold is met (applies to any rate type)
        const isFree = 
          rate.free_threshold !== null && 
          subtotal >= rate.free_threshold;
        
        return {
          id: rate.id,
          method_name: rate.method_name,
          rate_amount: isFree ? 0 : rate.rate_amount,
          is_free: isFree,
          display_order: rate.display_order,
        };
      });

      console.log('Matched zone:', matchedZone.name, 'rates:', applicableRates);

      return new Response(
        JSON.stringify({
          success: true,
          matched_zone: {
            id: matchedZone.id,
            name: matchedZone.name,
          },
          rates: applicableRates,
          fallback_used: false,
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
        matched_zone: null,
        rates: [
          {
            id: 'fallback',
            method_name: fallbackMethodName,
            rate_amount: fallbackRate,
            is_free: false,
            display_order: 0,
          },
        ],
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
