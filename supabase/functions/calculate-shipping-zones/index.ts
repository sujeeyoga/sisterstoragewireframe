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

/**
 * Extracts country codes from zone rules for pre-validation
 */
const getZoneCountries = (zone: ShippingZone): string[] => {
  return zone.rules
    .filter(r => r.rule_type === 'country')
    .map(r => r.rule_value.toUpperCase().trim());
};

// GTA zone ID - identifies the zone that should get free shipping over $50
const GTA_ZONE_ID = 'aa000000-0000-0000-0000-000000000001';

const matchesRule = (address: Address, rule: ShippingZoneRule): boolean => {
  const normalizedValue = rule.rule_value.toUpperCase().trim();
  
  switch (rule.rule_type) {
    case 'postal_code_pattern':
      // Handle wildcard pattern for catch-all
      if (rule.rule_value === '*') return true;
      return address.postalCode 
        ? matchesPostalPattern(address.postalCode, rule.rule_value)
        : false;
    case 'city':
      // Normalize city names: remove extra spaces, handle case
      const normalizedCity = address.city?.toUpperCase().trim().replace(/\s+/g, ' ');
      const normalizedRuleCity = normalizedValue.replace(/\s+/g, ' ');
      return normalizedCity === normalizedRuleCity;
    case 'province':
      return address.province?.toUpperCase().trim() === normalizedValue;
    case 'country':
      // Handle wildcard for catch-all fallback zone
      if (rule.rule_value === '*') return true;
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
    
    // CRITICAL: Country pre-validation to prevent cross-border city name collisions
    // Before checking any rules, validate that the address country matches zone requirements
    const zoneCountries = getZoneCountries(zone);
    if (zoneCountries.length > 0 && !zoneCountries.includes('*')) {
      const addressCountry = address.country?.toUpperCase().trim();
      
      if (!addressCountry || !zoneCountries.includes(addressCountry)) {
        // Country mismatch - skip this zone entirely to prevent false matches
        console.log(`🚫 Zone "${zone.name}" rejected - country mismatch:`, {
          zoneCountries,
          addressCountry,
          address: {
            city: address.city,
            province: address.province,
            postalCode: address.postalCode
          }
        });
        continue; // Skip to next zone
      }
      
      console.log(`✅ Zone "${zone.name}" country validated:`, {
        country: addressCountry,
        zoneCountries
      });
    }
    
    // Country is valid (or zone has no country restriction), proceed with rule matching
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
 * Calls ChitChats API to get real-time US shipping rates
 */
const getChitChatsRates = async (address: Address, supabase: any, packageInfo: any = {}): Promise<any> => {
  try {
    console.log('Fetching ChitChats rates for address:', address);
    
    const { data, error } = await supabase.functions.invoke('chitchats-shipping', {
      body: {
        action: 'get_rates',
        to_country: address.country || 'US',
        to_state: address.province,
        to_city: address.city,
        to_postal_code: address.postalCode || '',
        weight: packageInfo.weight || 500, // default 500g
        length: packageInfo.length || 25,
        width: packageInfo.width || 20,
        height: packageInfo.height || 10,
        package_value: packageInfo.value || 50,
      }
    });

    if (error) {
      console.error('ChitChats API error:', error);
      return null;
    }

    console.log('ChitChats rates response:', data);
    return data;
  } catch (error) {
    console.error('Error calling ChitChats API:', error);
    return null;
  }
};

/**
 * Transforms ChitChats rates to our rate format
 */
const transformChitChatsRates = (chitchatsData: any, subtotal: number): any[] => {
  // ChitChats returns: { success: true, data: { rates: [...] } }
  const rates = chitchatsData?.data?.rates || [];
  
  if (!rates || !Array.isArray(rates)) {
    console.log('No rates in ChitChats response');
    return [];
  }

  console.log(`Processing ${rates.length} ChitChats rates`);

  return rates
    .filter((rate: any) => rate.price && rate.name)
    .map((rate: any, index: number) => {
      const amount = parseFloat(rate.price);
      
      console.log(`ChitChats rate: ${rate.name} - $${amount.toFixed(2)} USD`);
      
      return {
        id: `chitchats_${rate.service_code || index}`,
        method_name: rate.name,
        rate_amount: parseFloat(amount.toFixed(2)),
        is_free: false,
        free_threshold: null,
        display_order: index + 1,
        carrier: rate.carrier,
        service_code: rate.service_code,
        delivery_estimate: rate.delivery_estimate,
      };
    })
    .sort((a, b) => a.rate_amount - b.rate_amount); // Sort by price
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

    // Log unmatched addresses for monitoring
    if (!matchResult) {
      console.log('⚠️ No zone matched for address:', {
        city: address.city,
        province: address.province,
        country: address.country,
        postalCode: address.postalCode,
      });
    }

    if (matchResult) {
      const { zone: matchedZone, matchedRule } = matchResult;
      
      let applicableRates = [];
      let rateSource = 'database';

      // For US zones, try to get real-time ChitChats rates
      const isUSZone = address.country?.toUpperCase() === 'US' || 
                       matchedRule.rule_value?.toUpperCase() === 'US';

      if (isUSZone) {
        console.log('US zone detected, fetching ChitChats rates...');
        const chitchatsData = await getChitChatsRates(address, supabase);
        
        if (chitchatsData?.success) {
          applicableRates = transformChitChatsRates(chitchatsData, subtotal);
          rateSource = 'chitchats';
          console.log('Using ChitChats rates:', applicableRates);
        }
      }

      // Fall back to appropriate rates if ChitChats failed
      if (applicableRates.length === 0) {
        if (isUSZone) {
          // US fallback: Higher safety rate if ChitChats completely fails
          console.log('⚠️ ChitChats API failed - using US safety fallback: $35');
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
          const gtaFreeShipping = isGTAZone && subtotal >= 50;
          
          if (gtaFreeShipping) {
            console.log('🎉 GTA Free Shipping unlocked! (subtotal >= $50, matched to GTA zone)');
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

    console.log('⚠️ Using fallback settings (no database zones matched):', {
      rate: fallbackRate,
      method: fallbackMethodName,
      address: {
        city: address.city,
        province: address.province,
        country: address.country,
        postalCode: address.postalCode,
      }
    });

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
