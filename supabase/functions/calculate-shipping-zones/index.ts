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
    const zoneCountries = getZoneCountries(zone);
    if (zoneCountries.length > 0 && !zoneCountries.includes('*')) {
      const addressCountry = address.country?.toUpperCase().trim();
      
      if (!addressCountry || !zoneCountries.includes(addressCountry)) {
        console.log(`🚫 Zone "${zone.name}" rejected - country mismatch:`, {
          zoneCountries,
          addressCountry,
          address: {
            city: address.city,
            province: address.province,
            postalCode: address.postalCode
          }
        });
        continue;
      }
      
      console.log(`✅ Zone "${zone.name}" country validated:`, {
        country: addressCountry,
        zoneCountries
      });
    }
    
    // Find the best matching rule for this zone
    let bestRuleMatch: { rule: ShippingZoneRule; priority: number } | null = null;
    const hasNonCountryRules = zone.rules.some(r => r.rule_type !== 'country');
    
    for (const rule of zone.rules) {
      if (matchesRule(address, rule)) {
        const rulePriority = getRulePriority(rule.rule_type);
        
        // Track the best rule match for this zone
        if (!bestRuleMatch || rulePriority > bestRuleMatch.priority) {
          bestRuleMatch = { rule, priority: rulePriority };
        }
      }
    }
    
    // If zone has non-country rules but only matched on country, skip it
    if (bestRuleMatch && hasNonCountryRules && bestRuleMatch.rule.rule_type === 'country') {
      console.log(`⚠️ Zone "${zone.name}" skipped - country-only match when specific rules exist`);
      continue;
    }
    
    // Update best overall match if this zone is better
    if (bestRuleMatch) {
      const totalPriority = zone.priority + bestRuleMatch.priority;
      
      if (!bestMatch || totalPriority > bestMatch.priority) {
        bestMatch = { 
          zone, 
          matchedRule: bestRuleMatch.rule, 
          priority: totalPriority 
        };
        console.log(`✅ New best match: "${zone.name}" (rule: ${bestRuleMatch.rule.rule_type}, priority: ${totalPriority})`);
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
  // ChitChats returns: { success: true, data: { shipment: { rates: [...] } } }
  const rates = chitchatsData?.data?.shipment?.rates || [];

  if (!Array.isArray(rates) || rates.length === 0) {
    console.log('No rates in ChitChats response');
    return [];
  }

  console.log(`Processing ${rates.length} ChitChats rates`);

  return rates
    .map((rate: any, index: number) => {
      const postageFee = parseFloat(rate.postage_fee || '0');
      const tariffFee = parseFloat(rate.tariff_fee || '0');
      const name = rate.postage_description || rate.postage_type || 'Shipping';

      console.log(`ChitChats rate: ${name} - postage $${postageFee.toFixed(2)} + duties $${tariffFee.toFixed(2)}`);

      return {
        id: `chitchats_${rate.postage_type || index}`,
        method_name: name,
        rate_amount: parseFloat(postageFee.toFixed(2)), // Only postage, not duties
        is_free: false,
        free_threshold: null,
        display_order: index + 1,
        carrier: rate.postage_carrier_type,
        service_code: rate.postage_type,
        delivery_estimate: rate.delivery_time_description,
        tariff_fee: parseFloat(tariffFee.toFixed(2)),
        postage_fee: parseFloat(postageFee.toFixed(2)),
        duties_included: false,
      };
    })
    .sort((a, b) => a.rate_amount - b.rate_amount); // Sort by postage cost
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

    const { address, subtotal, items = [] } = await req.json();

    console.log('Calculating shipping for address:', address, 'subtotal:', subtotal, 'items:', items.length);

    // Fetch packaging profiles from store settings
    const { data: packagingProfilesData } = await supabase
      .from('store_settings')
      .select('setting_value')
      .eq('setting_key', 'packaging_profiles')
      .maybeSingle();

    const packagingProfiles = packagingProfilesData?.setting_value || {
      small: { length_in: 16, width_in: 12, height_in: 4, empty_weight_g: 200 },
      large: { length_in: 16, width_in: 12, height_in: 12, empty_weight_g: 450 },
    };

    // Calculate package info from cart items
    let totalProductWeight = 0;
    let totalValue = 0;
    let has4RodBox = false;

    if (items && items.length > 0) {
      // Fetch product details for weight calculation
      const productIds = items.map((item: any) => item.id);
      
      const { data: products, error: productsError } = await supabase
        .from('woocommerce_products')
        .select('id, weight, price, name')
        .in('id', productIds);

      if (!productsError && products) {
        console.log('Fetched product weights:', products);
        
        items.forEach((item: any) => {
          const product = products.find(p => p.id === item.id);
          if (product) {
            // Weight is in grams, multiply by quantity
            const itemWeight = (product.weight || 500) * (item.quantity || 1);
            totalProductWeight += itemWeight;
            
            // Check if order contains 4-rod boxes (typically larger)
            if (product.name?.toLowerCase().includes('4-rod') || 
                product.name?.toLowerCase().includes('large') ||
                product.weight > 600) {
              has4RodBox = true;
            }
            
            // Calculate total value for customs
            totalValue += (product.price || 50) * (item.quantity || 1);
          }
        });
      }
    }

    // Select packaging profile: large if has 4-rod or total weight > 3kg, else small
    const selectedProfile = (has4RodBox || totalProductWeight > 3000) 
      ? packagingProfiles.large 
      : packagingProfiles.small;

    // Convert inches to cm and add empty box weight
    const packageInfo = {
      weight: totalProductWeight + selectedProfile.empty_weight_g,
      length: Math.round(selectedProfile.length_in * 2.54), // inches to cm
      width: Math.round(selectedProfile.width_in * 2.54),
      height: Math.round(selectedProfile.height_in * 2.54),
      value: totalValue || 50,
    };

    console.log('Selected packaging profile:', has4RodBox ? 'large' : 'small', packageInfo);

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

      // For US or UK zones, try to get real-time ChitChats rates
      const isUSZone = address.country?.toUpperCase() === 'US' || 
                       matchedRule.rule_value?.toUpperCase() === 'US';
      const isUKZone = address.country?.toUpperCase() === 'GB' || 
                       address.country?.toUpperCase() === 'UK' ||
                       matchedRule.rule_value?.toUpperCase() === 'GB';

      if (isUSZone || isUKZone) {
        const zoneLabel = isUSZone ? 'US' : 'UK';
        console.log(`${zoneLabel} zone detected, fetching ChitChats rates with package info:`, packageInfo);
        const chitchatsData = await getChitChatsRates(address, supabase, packageInfo);
        
        if (chitchatsData?.success) {
          applicableRates = transformChitChatsRates(chitchatsData, subtotal);
          rateSource = 'chitchats';
          console.log(`Using ChitChats rates for ${zoneLabel}:`, applicableRates);
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
        } else if (isUKZone) {
          // UK fallback: Use database rates if ChitChats fails
          console.log('⚠️ ChitChats API failed for UK - using database rates');
          applicableRates = matchedZone.rates.map(rate => ({
            id: rate.id,
            method_name: rate.method_name,
            rate_amount: rate.rate_amount,
            is_free: false,
            free_threshold: rate.free_threshold,
            display_order: rate.display_order,
          }));
          rateSource = 'database';
        } else {
          // Non-US/UK: use database rates with free threshold logic
          console.log('Using database rates for non-US zone');
          
          applicableRates = matchedZone.rates.map(rate => {
            const isFree = 
              rate.free_threshold !== null && 
              subtotal >= rate.free_threshold;
            
            return {
              id: rate.id,
              method_name: rate.method_name,
              rate_amount: isFree ? 0 : rate.rate_amount,
              is_free: isFree,
              free_threshold: rate.free_threshold,
              display_order: rate.display_order,
            };
          });
          rateSource = 'database';
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
